export const shapeData = new Array(10000);

export function setShapeAttribs(square, options = {}, index = null) {
    square.setAttribute('data-label', options.label || '');
    square.setAttribute('data-type', options.type || 'unset');
    square.setAttribute('data-source-data', options.sourceData || 'unset');
    square.setAttribute('data-snap-point', options.snapPoint ? JSON.stringify(options.snapPoint) : 'null');
    if (options.id) square.id = options.id;
    if (options.width) square.style.width = options.width;
    if (options.height) square.style.height = options.height;
    if (options.shape) {
        square.setAttribute('data-shape', options.shape);
        if (options.shape === 'RoundedRectangle') {
            square.style.borderRadius = '18px';
        } else {
            square.style.borderRadius = '';
        }
    }
    if (typeof index === 'number' && index >= 0 && index < shapeData.length) {
        shapeData[index] = {
            label: options.label || '',
            type: options.type || 'unset',
            sourceData: options.sourceData || 'unset',
            snapPoint: options.snapPoint || null,
            id: options.id || square.id || null,
            width: options.width || square.style.width || null,
            height: options.height || square.style.height || null,
            shape: options.shape || 'RoundedRectangle'
        };
    }
}
