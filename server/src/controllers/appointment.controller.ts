import { Request, Response } from "express";
import { Appointment } from "../models/appointment.model.js";

export async function createAppointment(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const doctorId = req.user!.userId;

    // Auto-generate token number for the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastAppointment = await Appointment.findOne({
      clinicId,
      doctorId,
      appointmentDate: { $gte: today, $lt: tomorrow },
    }).sort({ tokenNumber: -1 });

    const tokenNumber = lastAppointment ? lastAppointment.tokenNumber + 1 : 1;

    const appointment = await Appointment.create({
      ...req.body,
      clinicId,
      doctorId,
      tokenNumber,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("[Appointment] create error:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
}

export async function getAppointments(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const { date, status, patientId, page = "1", limit = "50" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = { clinicId };

    if (date) {
      const dayStart = new Date(date as string);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      filter.appointmentDate = { $gte: dayStart, $lt: dayEnd };
    }

    if (status) {
      filter.status = status;
    }

    if (patientId) {
      filter.patientId = patientId;
    }

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate("patientId", "fullName phone patientUid")
        .populate("doctorId", "fullName specialization")
        .sort({ tokenNumber: 1 })
        .skip(skip)
        .limit(limitNum),
      Appointment.countDocuments(filter),
    ]);

    res.status(200).json({
      data: appointments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("[Appointment] getAll error:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
}

export async function getTodayQueue(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const doctorId = req.user!.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      clinicId,
      doctorId,
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: { $in: ["waiting", "in_consultation"] },
    })
      .populate("patientId", "fullName phone patientUid age gender")
      .sort({ tokenNumber: 1 });

    const stats = await Appointment.aggregate([
      {
        $match: {
          clinicId: appointments.length > 0 ? appointments[0].clinicId : null,
          doctorId: appointments.length > 0 ? appointments[0].doctorId : null,
          appointmentDate: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts: Record<string, number> = {};
    for (const s of stats) {
      statusCounts[s._id] = s.count;
    }

    res.status(200).json({
      queue: appointments,
      stats: {
        waiting: statusCounts["waiting"] || 0,
        inConsultation: statusCounts["in_consultation"] || 0,
        done: statusCounts["done"] || 0,
        cancelled: statusCounts["cancelled"] || 0,
        noShow: statusCounts["no_show"] || 0,
        total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
      },
    });
  } catch (error) {
    console.error("[Appointment] todayQueue error:", error);
    res.status(500).json({ error: "Failed to fetch today's queue" });
  }
}

export async function getAppointmentById(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const appointment = await Appointment.findOne({ _id: req.params.id, clinicId })
      .populate("patientId", "fullName phone patientUid age gender bloodGroup")
      .populate("doctorId", "fullName specialization qualification");

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("[Appointment] getById error:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
}

export async function updateAppointment(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;

    // Track status transitions
    const updateData = { ...req.body };
    if (updateData.status === "in_consultation" && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }
    if (updateData.status === "done" && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, clinicId },
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("patientId", "fullName phone patientUid")
      .populate("doctorId", "fullName specialization");

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("[Appointment] update error:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
}

export async function deleteAppointment(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, clinicId });

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("[Appointment] delete error:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
}
