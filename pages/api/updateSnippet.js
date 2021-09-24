import { updateSnippet, getSnippetById } from "../../utils/Fauna";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const { id, code, language, description, name } = req.body;

  try {
    const updated = await updateSnippet(id, code, language, name, description);
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
