import { getSnippets } from "../../utils/Fauna";
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405);
  }
  try {
    const snippets = await getSnippets();
    console.log('hello')
    console.log(snippets);
    return res.status(200).json(snippets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
