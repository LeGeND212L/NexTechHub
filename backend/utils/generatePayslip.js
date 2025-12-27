const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePayslip = async (paymentData) => {
    return new Promise((resolve, reject) => {
        try {
            // Create payslips directory if it doesn't exist
            const payslipsDir = path.join(__dirname, '../uploads/payslips');
            if (!fs.existsSync(payslipsDir)) {
                fs.mkdirSync(payslipsDir, { recursive: true });
            }

            // Generate filename
            const filename = `payslip-${paymentData.employee._id}-${paymentData.month}-${paymentData.year}-${Date.now()}.pdf`;
            const filepath = path.join(payslipsDir, filename);

            // Create PDF document
            const doc = new PDFDocument({ margin: 50 });
            const writeStream = fs.createWriteStream(filepath);
            doc.pipe(writeStream);

            // Header
            doc.fontSize(24).text('NexTechHubs', { align: 'center' });
            doc.fontSize(12).text('Salary Slip', { align: 'center' });
            doc.moveDown();

            // Add line
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            // Employee Details
            doc.fontSize(14).text('Employee Details:', { underline: true });
            doc.fontSize(11);
            doc.text(`Name: ${paymentData.employee.name}`);
            doc.text(`Email: ${paymentData.employee.email}`);
            doc.text(`Designation: ${paymentData.employee.designation || 'N/A'}`);
            doc.text(`Department: ${paymentData.employee.department || 'N/A'}`);
            doc.moveDown();

            // Payment Details
            doc.fontSize(14).text('Payment Details:', { underline: true });
            doc.fontSize(11);
            doc.text(`Month/Year: ${paymentData.month} ${paymentData.year}`);
            doc.text(`Payment Date: ${new Date(paymentData.paymentDate).toLocaleDateString()}`);
            doc.text(`Payment Method: ${paymentData.paymentMethod.toUpperCase()}`);
            if (paymentData.transactionId) {
                doc.text(`Transaction ID: ${paymentData.transactionId}`);
            }
            doc.moveDown();

            // Salary Breakdown
            doc.fontSize(14).text('Salary Breakdown:', { underline: true });
            doc.fontSize(11);

            const startY = doc.y;
            doc.text('Basic Salary:', 50, startY);
            doc.text(`Rs. ${paymentData.amount.toFixed(2)}`, 450, startY, { align: 'right' });

            doc.text('Bonus:', 50, doc.y);
            doc.text(`Rs. ${paymentData.bonus.toFixed(2)}`, 450, doc.y - 12, { align: 'right' });

            doc.text('Deductions:', 50, doc.y);
            doc.text(`Rs. ${paymentData.deductions.toFixed(2)}`, 450, doc.y - 12, { align: 'right' });

            doc.moveDown();
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);

            // Net Salary
            doc.fontSize(14).text('Net Salary:', 50, doc.y, { bold: true });
            doc.fontSize(14).text(`Rs. ${paymentData.netSalary.toFixed(2)}`, 450, doc.y - 14, { align: 'right', bold: true });

            doc.moveDown(2);

            // Notes
            if (paymentData.notes) {
                doc.fontSize(10).text(`Notes: ${paymentData.notes}`, { align: 'left' });
                doc.moveDown();
            }

            // Footer
            doc.fontSize(9).text(
                'This is a computer-generated payslip and does not require a signature.',
                50,
                700,
                { align: 'center', width: 500 }
            );

            doc.fontSize(8).text(
                `Generated on: ${new Date().toLocaleString()}`,
                50,
                720,
                { align: 'center', width: 500 }
            );

            // Finalize PDF
            doc.end();

            writeStream.on('finish', () => {
                resolve(`uploads/payslips/${filename}`);
            });

            writeStream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = generatePayslip;
