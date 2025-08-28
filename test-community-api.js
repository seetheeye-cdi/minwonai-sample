// Test community API endpoints
const baseUrl = 'http://localhost:3001/api/trpc';

// Test getPublicTickets
fetch(`${baseUrl}/community.getPublicTickets?batch=1&input=${encodeURIComponent(JSON.stringify({
  "0": {
    "json": {
      "limit": 20,
      "offset": 0,
      "category": null
    }
  }
}))}`)
  .then(res => {
    console.log('getPublicTickets status:', res.status);
    return res.json();
  })
  .then(data => console.log('getPublicTickets response:', data))
  .catch(err => console.error('getPublicTickets error:', err));

// Test createPublicTicket
fetch(`${baseUrl}/community.createPublicTicket?batch=1`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "0": {
      "json": {
        "organizationId": "org_default_community",
        "citizenName": "테스트 시민",
        "citizenPhone": "010-1234-5678",
        "citizenEmail": "test@example.com",
        "content": "테스트 민원 내용입니다.",
        "category": "general",
        "isPublic": true,
        "nickname": "테스트닉네임"
      }
    }
  })
})
  .then(res => {
    console.log('createPublicTicket status:', res.status);
    return res.json();
  })
  .then(data => console.log('createPublicTicket response:', data))
  .catch(err => console.error('createPublicTicket error:', err));
