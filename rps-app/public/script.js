async function play(choice) {
  const res = await fetch(`/play?choice=${choice}`);
  const data = await res.json();

  document.getElementById("result").textContent = data.result;
  document.getElementById("details").textContent =
    `You chose ${data.user}, computer chose ${data.computer}`;
}