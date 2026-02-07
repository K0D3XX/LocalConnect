cat > api/jobs.js << 'EOF'
export default async function handler(req, res) {
  // Mock data for now
  const jobs = [
    {
      id: 1,
      title: "Barista",
      company: "Blue Bottle Coffee",
      category: "Food Service",
      description: "Looking for an experienced barista.",
      lat: -24.6282,
      lng: 25.9231,
      salary: "BWP 50/hr",
      type: "Part-time",
      contactPhone: "555-0101",
    },
    {
      id: 2,
      title: "Warehouse Worker",
      company: "Logistics Pro",
      category: "Labor",
      description: "Entry level position.",
      lat: -24.6382,
      lng: 25.9131,
      salary: "BWP 60/hr",
      type: "Full-time",
      contactPhone: "555-0102",
    }
  ];

  res.status(200).json(jobs);
}
EOF