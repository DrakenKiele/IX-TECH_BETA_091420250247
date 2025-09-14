import { createToggleButton } from './button-maker.js';
import { customButtons } from './button-maker.js';

let metaButtonCount = 1;

export function createMetaCreateButton(config = {}) {
  createToggleButton({
    id: 'meta-create-btn',
    label: 'Create Button',
    right: '10px',
    ...config,
    onEnable: () => {
      // When enabled, create a new custom button
      const newId = `user-btn-${metaButtonCount}`;
      const btn = createToggleButton({
        id: newId,
        label: `User Button ${metaButtonCount}`,
        right: '150px',
        initialTop: 10 + metaButtonCount * 50,
        onEnable: () => {},
        onDisable: () => {},
        defaultActiveState: 'on',
        isSelectable: true,
        isDeletable: true,
      });
      // Custom button object
      const customButton = {
        id: newId,
        type: 'button',
        label: `User Button ${metaButtonCount}`,
        domElement: btn,
        isSelectable: true,
        isDeletable: true,
        functionRef: null,
        owner: 'user',
        isUserCreated: true
      };
      customButtons.push(customButton);
      metaButtonCount++;
    },
    onDisable: () => {},
    defaultActiveState: 'on',
  });
}
