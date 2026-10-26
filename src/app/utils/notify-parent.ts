/** Posts a message to the host page embedding this SDK in an iframe. */
export function notifyParent(type: string, data: any): void {
  window.parent.postMessage(
    {
      type,
      data,
      source: 'SDK',
    },
    '*',
  );
}
