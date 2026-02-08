export async function fetchGithubAvatar() {
  const req = await fetch("https://api.github.com/users/mikeangelotho");
  if (req.ok) {
    const json: any = await req.json();
    return json["avatar_url"];
  }
}