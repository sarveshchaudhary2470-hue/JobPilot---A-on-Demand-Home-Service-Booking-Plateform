import fetch from 'node-fetch';

async function testBanner() {
    try {
        const payload = {
            image: "http://example.com/test.png",
            title: "Test Banner",
            link: "",
            isActive: true
        };

        const res = await fetch('http://localhost:5000/api/admin/banners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text.substring(0, 500));
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

testBanner();
