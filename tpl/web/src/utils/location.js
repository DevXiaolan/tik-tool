import $ from 'jquery';

// 相对区域宽
const defaultAreaWidth = $(window).width();
// 画布宽
const defaultCanvasWidth = 750;

/**
 * 获取定位
 * @param width         宽
 * @param height        高
 * @param x             X坐标
 * @param y             Y坐标
 * @param areaWidth     相对区域宽
 * @param canvasWidth   画布宽
 */
export const getLocation = (width, height, x, y, areaWidth=defaultAreaWidth, canvasWidth=defaultCanvasWidth) => {
    const scale = areaWidth / canvasWidth;
    return {
        width : width * scale,
        height : height * scale,
        x : x * scale,
        y : y * scale
    }
}

/**
 * 获取位置
 * @param position      位置
 * @param areaWidth     相对区域宽
 * @param canvasWidth   画布宽
 * @returns {number}
 */
export const getPosition = (position, areaWidth=defaultAreaWidth, canvasWidth=defaultCanvasWidth) => {
    const scale = areaWidth / canvasWidth;
    return position * scale;
}