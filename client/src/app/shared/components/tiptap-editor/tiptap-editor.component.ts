import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  viewChild,
  input,
  output,
} from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'app-tiptap-editor',
  standalone: true,
  templateUrl: './tiptap-editor.component.html',
  styleUrl: './tiptap-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiptapEditorComponent implements AfterViewInit, OnDestroy {
  content = input<string>('');
  contentChange = output<string>();

  private editorContainer = viewChild.required<ElementRef>('editorContainer');
  private editor: Editor | null = null;

  ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorContainer().nativeElement,
      extensions: [StarterKit],
      content: this.content(),
      onUpdate: ({ editor }) => {
        this.contentChange.emit(editor.getHTML());
      },
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  toggleBold(): void {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic(): void {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleBulletList(): void {
    this.editor?.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList(): void {
    this.editor?.chain().focus().toggleOrderedList().run();
  }

  setHeading(level: 1 | 2 | 3): void {
    this.editor?.chain().focus().toggleHeading({ level }).run();
  }

  isActive(name: string, attrs?: Record<string, any>): boolean {
    return this.editor?.isActive(name, attrs) ?? false;
  }
}
