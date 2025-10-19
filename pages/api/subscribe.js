export default async function handler(req, res) {
  const subscription = req.body;
  // Store in DB or memory (for demo, just log it)
  console.log('Received subscription:', subscription);
  res.status(201).json({});
}
