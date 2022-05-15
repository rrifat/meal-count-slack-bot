// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from "./supabase";

export default async function handler(req, res) {
  const { user_name, text } = req.body;
  let { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("user_name", user_name);

  console.log("RESPONSE =>>", { member, error });

  if (member && !error) {
    const { data, error } = await supabase
      .from("members")
      .upsert({ user_name, have_meal: text === "on" ? true : false });
    // .eq("user_name", user_name);
    console.log("INSERT & UPDATE =>>", { data, error });
  } else if (member.length === 0 && !error) {
    const { data, error } = await supabase
      .from("members")
      .insert([{ user_name, have_meal: text === "on" ? true : false }]);

    console.log("UPDATE =>>", { data, error });
  } else {
    console.log("ERROR =>>", error);
    res.status(400).json(error);
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
