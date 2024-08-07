export function verLine(ctx, x, y1, y2, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    if (Math.random() < 0.01) {
        console.log(x, y1, y2);
    }
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
}
