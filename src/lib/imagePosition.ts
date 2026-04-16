export type ObjectPosition =
  | 'top left' | 'top' | 'top right'
  | 'left'     | 'center' | 'right'
  | 'bottom left' | 'bottom' | 'bottom right';

const POSITIONS: { value: ObjectPosition; cls: string }[] = [
  { value: 'top left',     cls: 'object-left-top'    },
  { value: 'top',          cls: 'object-top'         },
  { value: 'top right',    cls: 'object-right-top'   },
  { value: 'left',         cls: 'object-left'        },
  { value: 'center',       cls: 'object-center'      },
  { value: 'right',        cls: 'object-right'       },
  { value: 'bottom left',  cls: 'object-left-bottom' },
  { value: 'bottom',       cls: 'object-bottom'      },
  { value: 'bottom right', cls: 'object-right-bottom'},
];

export const ALL_POSITIONS = POSITIONS;

export function positionClass(pos?: string | null): string {
  return POSITIONS.find(p => p.value === pos)?.cls ?? 'object-center';
}
