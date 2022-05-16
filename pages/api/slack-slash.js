import supabase from "./supabase";

export default async function handler(req, res) {
  const { user_name, text } = req.body;
  if (!["on", "off"].includes(text)) {
    res.status(500);
  }

  let { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("user_name", user_name);

  if (member && !error) {
    const { data, error } = await supabase
      .from("members")
      .update({ have_meal: text === "on" ? true : false })
      .eq("user_name", user_name);
    error && res.status(500).json(error);
  } else if (member.length === 0 && !error) {
    const { data, error } = await supabase
      .from("members")
      .insert([{ user_name, have_meal: text === "on" ? true : false }]);
    error && res.status(500).json(error);
  } else {
    res.status(500).json(error);
  }
  res.status(200).json({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `* <@${user_name}> your next day meal is ${text.toUpperCase()}.*`,
        },
      },
    ],
  });
}
