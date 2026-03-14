const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
    // Create a dummy text file to test the error filter, or a dummy image
    fs.writeFileSync('test.png', 'fake image content');

    const formData = new FormData();
    formData.append('image', fs.createReadStream('test.png'));

    // Try without auth first to see if we get the correct JSON 401 error
    try {
        const res = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

testUpload();
