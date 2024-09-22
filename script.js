document.getElementById('release-form').addEventListener('submit', function(e) {
    e.preventDefault();
    generateRelease();
});

function generateRelease() {
    const canvas = document.getElementById('release-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set initial canvas size
    canvas.width = 1100;
    canvas.height = 1600;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Function to draw all content
    function drawContent() {
        // Draw logo
        ctx.drawImage(logo, 50, 50, 150, 150);
        
        // Draw "NEWS RELEASE"
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('NEWS RELEASE', 50, 240);
        
        // Draw "For Immediate Release"
        ctx.font = 'italic 20px Arial';
        ctx.fillStyle = 'grey';
        ctx.fillText('For Immediate Release', 50, 270);
        
        // Draw contact information
        ctx.font = '18px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        ctx.fillText('Media Contact:', canvas.width - 50, 70);
        ctx.fillText('Public Information Office', canvas.width - 50, 95);
        ctx.fillText('9101 Maple Street', canvas.width - 50, 120);
        ctx.fillText('Fort Worth, TX', canvas.width - 50, 145);
        ctx.fillText('or contact FWPD via DPD server', canvas.width - 50, 170);
        
        // Draw title (centered)
        const title = document.getElementById('title').value;
        ctx.font = 'bold 24px "Times New Roman"';
        ctx.textAlign = 'center';
        ctx.fillText(`NEWS RELEASE: ${title}`, canvas.width / 2, 320);
        
        // Reset text alignment for subsequent text
        ctx.textAlign = 'left';
        
        // Draw date and start of content
        const inputDate = new Date(document.getElementById('release-date').value);
        // Add one day to the input date
        const date = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate() + 1, 12, 0, 0);
        const content = document.getElementById('content').value;
        
        // Format the date with month name
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        // Draw the bold part (before the dash)
        ctx.font = 'bold 20px "Times New Roman"';
        const boldText = `Fort Worth, Texas (${formattedDate}) -`;
        ctx.fillText(boldText, 50, 360);

        // Calculate the starting position for the content
        const boldWidth = ctx.measureText(boldText).width;
        const contentStartX = 50 + boldWidth;

        // Switch to non-bold for the content
        ctx.font = '20px "Times New Roman"';

        // Wrap and draw content
        return wrapText(ctx, content, contentStartX, 360, canvas.width - 100, 25);
    }

    // Load logo and footer images
    const logo = new Image();
    const footer = new Image();
    
    logo.onload = function() {
        footer.onload = function() {
            const contentY = drawContent();
            
            // Calculate new dimensions for the footer
            const footerWidth = footer.width * 0.625;
            const footerHeight = footer.height * 0.625;
            
            const footerY = contentY + 100;
            
            // Adjust canvas height and redraw everything
            canvas.height = footerY + footerHeight + 50;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            drawContent();
            
            // Draw footer
            ctx.drawImage(footer, 
                          canvas.width / 2 - footerWidth / 2,
                          footerY, 
                          footerWidth, 
                          footerHeight);
            
            // Enable download
            const downloadLink = document.getElementById('download-link');
            downloadLink.href = canvas.toDataURL('image/png');
        };
        footer.src = 'https://i.imgur.com/P0H3VaP.png';
    };
    logo.src = 'https://i.imgur.com/w4NK8oX.png';
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    let isFirstLine = true;

    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, isFirstLine ? x : 50, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
            isFirstLine = false;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, isFirstLine ? x : 50, currentY);
    return currentY + lineHeight;
}
