function redirectToGoogle() {
    window.open('phonepe://pay?pa=jatinjkagrawal-1@okhdfcbank&am=1999');
}

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scratchCard = document.getElementById('scratchCard');
    const instructions = document.querySelector('.instructions');
    const revealedContent = document.getElementById('revealedContent');
    const revealButton = document.getElementById('revealButton');

    // Set canvas size
    canvas.width = scratchCard.offsetWidth;
    canvas.height = scratchCard.offsetHeight;

    // Initialize variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Draw the scratch card
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Event listeners for desktop
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseout', handleEnd);

    // Event listeners for touch devices
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);

    function handleStart(e) {
        e.preventDefault();
        isDrawing = true;
        if (e.type === 'mousedown') {
            [lastX, lastY] = [e.offsetX, e.offsetY];
        } else if (e.type === 'touchstart') {
            [lastX, lastY] = [e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop];
        }
    }

    function handleMove(e) {
        e.preventDefault();
        if (!isDrawing) return;
        let x, y;
        if (e.type === 'mousemove') {
            x = e.offsetX;
            y = e.offsetY;
        } else if (e.type === 'touchmove') {
            x = e.touches[0].clientX - canvas.offsetLeft;
            y = e.touches[0].clientY - canvas.offsetTop;
        }
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }

    function handleEnd() {
        isDrawing = false;
        checkScratchPercentage();
    }

    // Function to check the scratch percentage
    function checkScratchPercentage() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let count = 0;

        for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] === 0) {
                count++;
            }
        }

        const totalPixels = canvas.width * canvas.height;
        const percentage = (count / totalPixels) * 100;

        if (percentage > 30) { // Adjust the percentage threshold as needed
            // Card is scratched off, reveal content
            revealedContent.style.display = 'block';
            revealButton.style.display = 'block';
            instructions.style.display = 'none';
        }
    }
});
