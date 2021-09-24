import { deleteSnippet } from "../../utils/Fauna";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const { id } = req.body;

  try {
    const deleted = await deleteSnippet(id);
    return res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
