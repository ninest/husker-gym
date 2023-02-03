export default function Head() {
  return (
    <>
      <title>Husker Gym</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="Find the best times to go to the gym" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="theme-color" content="#000000" />

      {process.env.NODE_ENV === "production" && (
        <>
          <script
            data-goatcounter="https://husker-gym.goatcounter.com/count"
            async
            src="//gc.zgo.at/count.js"
          ></script>
        </>
      )}
    </>
  );
}
