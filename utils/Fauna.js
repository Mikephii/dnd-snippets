const faunadb = require("faunadb");
const faunaClient = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
const q = faunadb.query;

const getSnippets = async () => {
  const { data } = await faunaClient.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("snippets"))),
      q.Lambda("ref", q.Get(q.Var("ref")))
    )
  );
  console.log(data);

  const snippets = data.map((snippet) => {
    snippet.id = snippet.ref.id;
    delete snippet.ref;
    return snippet;
  });
  return snippets;
};

const getSnippetById = async (id) => {
  const snippet = await faunaClient.query(
    q.Get(q.Ref(q.Collection("snippets"), id))
  );
  snippet.id = snippet.ref.id;
  delete snippet.ref;
  return snippet;
};

const getSnippetsByUser = async () => {};

const getSnippetsByLanguage = async () => {};

const createSnippet = async (code, language, description, name) => {
  const createdSnippet = await faunaClient.query(
    q.Create(q.Collection("snippets"), {
      data: { code, language, description, name },
    })
  );
  createdSnippet.id = createdSnippet.ref.id;
  delete createdSnippet.ref;

  let layout = await getLayout("guest");

  layout.data.layout.push(createdSnippet.id);

  await updateLayout(layout.data.layout, layout.id);

  return createdSnippet;
};

const updateSnippet = async (id, code, language, name, description) => {
  return await faunaClient.query(
    q.Update(q.Ref(q.Collection("snippets"), id), {
      data: { code, language, name, description },
    })
  );
};

const deleteSnippet = async (id) => {
  return await faunaClient.query(q.Delete(q.Ref(q.Collection("snippets"), id)));
};

const getLayout = async (user) => {
  const layout = await faunaClient.query(
    q.Get(q.Match(q.Index("get_layout_by_user"), user))
  );

  layout.id = layout.ref.id;
  delete layout.ref;
  return layout;
};

const updateLayout = async (layout, id) => {
  return await faunaClient.query(
    q.Update(q.Ref(q.Collection("layouts"), id), {
      data: {
        layout,
      },
    })
  );
};

module.exports = {
  createSnippet,
  getSnippets,
  getSnippetById,
  getSnippetsByUser,
  updateSnippet,
  deleteSnippet,
  getSnippetsByLanguage,
  getLayout,
  updateLayout,
};
