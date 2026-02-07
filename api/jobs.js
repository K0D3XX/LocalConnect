// Simple Vercel serverless function
export default function handler(request, response) {
  const jobs = [
    {
      id: 1,
      title: "Test Job",
      company: "Test Company",
      lat: -24.6282,
      lng: 25.9231,
      salary: "BWP 50/hr"
    }
  ];
  
  response.status(200).json(jobs);
}
