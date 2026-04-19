import { DodsStoryMeta } from './playground.types';

export const STORY_INDEX: Record<string, Omit<DodsStoryMeta, 'id'>> = {
  'tokens':       { name: 'Tokens',       group: 'Foundations', icon: 'pi pi-palette' },
  'button':       { name: 'Button',       group: 'Actions',     icon: 'pi pi-bolt' },
  'card':         { name: 'Card',         group: 'Surfaces',    icon: 'pi pi-id-card' },
  'divider':      { name: 'Divider',      group: 'Surfaces',    icon: 'pi pi-minus' },
  'input':        { name: 'Input',        group: 'Forms',       icon: 'pi pi-pencil' },
  'textarea':     { name: 'Textarea',     group: 'Forms',       icon: 'pi pi-align-left' },
  'select':       { name: 'Select',       group: 'Forms',       icon: 'pi pi-chevron-down' },
  'checkbox':     { name: 'Checkbox',     group: 'Forms',       icon: 'pi pi-check-square' },
  'radio':        { name: 'Radio',        group: 'Forms',       icon: 'pi pi-circle' },
  'switch':       { name: 'Switch',       group: 'Forms',       icon: 'pi pi-power-off' },
  'badge':        { name: 'Badge',        group: 'Data display', icon: 'pi pi-tag' },
  'chip':         { name: 'Chip',         group: 'Data display', icon: 'pi pi-hashtag' },
  'avatar':       { name: 'Avatar',       group: 'Data display', icon: 'pi pi-user' },
  'tabs':         { name: 'Tabs',         group: 'Navigation',  icon: 'pi pi-th-large' },
  'modal':        { name: 'Modal',        group: 'Overlays',    icon: 'pi pi-window-maximize' },
  'toast':        { name: 'Toast',        group: 'Overlays',    icon: 'pi pi-comment' },
  'tooltip':      { name: 'Tooltip',      group: 'Overlays',    icon: 'pi pi-info-circle' },
  'spinner':      { name: 'Spinner',      group: 'Feedback',    icon: 'pi pi-spinner' },
  'progress-bar': { name: 'Progress bar', group: 'Feedback',    icon: 'pi pi-chart-bar' },
};
