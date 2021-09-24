import { getLayout } from "../../../utils/Fauna";
export default async function handler(req, res) {
  const { user } = req.query;

  if (req.method !== "GET") {
    return res.status(405);
  }
  try {
    const layout = await getLayout(user);
    console.log(layout);
    return res.status(200).json(layout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
