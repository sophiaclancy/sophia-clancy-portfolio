// about-v2.jsx — About page, rendered inside the sidebar shell from app-v13.
// Written in Sophia's own voice (casual, short, plain). Facts are only what she's told us.
// CLANCYSTUFF: the photo dump. Drop photos in assets/about/clancystuff/ and list them below.
(function () {
  const COMMUNITIES = [
    { logo: "assets/logo-bi.png", fill: true, org: "Berkeley Innovation", role: "Project Lead", note: "I lead a design team on client projects. It's where Notability and Partake came from." },
    { logo: "assets/logo-mdb.png", bg: "#DCEBFA", org: "Mobile Developers of Berkeley", role: "VP of Marketing", note: "Where I first learned to code. Now I run our socials and recruiting." },
    { logo: "assets/logo-jacobs.png", org: "Jacobs Institute", role: "Figma Course Instructor", note: "I teach students Figma." },
    { logo: "assets/logo-partiful.png", fill: true, org: "Partiful", role: "Growth Ambassador", note: "I help clubs on campus get people together." },
  ];

  // e.g. { src: "assets/about/clancystuff/zouk.jpg", cap: "zouk night", tall: true }
  const CLANCYSTUFF = [];

  function AboutMain() {
    return (
      <div className="ab2">
        <section className="ab2-intro">
          <div className="ab2-intro-txt">
            <h1 className="ab2-h1">Hi, I&rsquo;m Sophia!</h1>
            <p>I study cognitive science and data science at Berkeley. I started in frontend and full stack dev, got hooked on design, and now do a bit of everything: research, design, and building.</p>
            <p>I&rsquo;m really into the human mind. I worked as a behavior technician the summer after freshman year and loved it. I&rsquo;ve also always been obsessed with AI, world building, and imagination.</p>
          </div>
          <figure className="ab2-photo">
            <span className="ab2-photo-frame">
              <img className="ab2-base" src="assets/about-default.jpg" alt="Sophia holding a lemon slice" />
              <img className="ab2-hover" src="assets/about-hover.jpg" alt="" />
            </span>
          </figure>
        </section>

        <section className="ab2-sec">
          <h2 className="ab2-h">Why bugs?</h2>
          <p>Casper was a ghost mantis I got during quarantine. I&rsquo;ve collected mantises ever since.</p>
          <p>Ants are how I think about people. One ant on its own doesn&rsquo;t do much, but a colony builds, farms, and finds food without anyone telling it what to do. All the smarts are in how they work together.</p>
          <p>So when I look at a problem, I don&rsquo;t start with one person. I look at the group: what everyone is doing, what&rsquo;s pushing them to do it, and what happens when all those choices add up. Most of what goes wrong (and right) in products, schools, and society comes from small habits stacking up, not one big decision.</p>
          <p>That&rsquo;s what I like designing for. Change one small thing in the environment and the whole colony can move differently.</p>
          <p className="ab2-more"><a href="Why-Bugs.html">If you want to hear more in depth, I wrote about it here &rarr;</a></p>
        </section>

        <section className="ab2-sec">
          <h2 className="ab2-h">Communities</h2>
          <p className="ab2-sub">The people who make it all worth it.</p>
          <ul className="ab2-comm">
            {COMMUNITIES.map((c) => (
              <li key={c.org}>
                <span className="ab2-logo" style={c.bg ? { background: c.bg } : null}><img src={c.logo} alt="" className={c.fill ? "is-fill" : undefined} /></span>
                <span className="ab2-comm-t"><b>{c.org}</b> <span className="ab2-role">{c.role}</span><span className="ab2-note">{c.note}</span></span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ab2-sec">
          <h2 className="ab2-h">Outside of work</h2>
          <p>Solo travel, tandem biking, soccer, pickleball, Brazilian zouk, painting, and a lot of concerts. Next up: music production and fine dining cooking. Big fan of Anthony Bourdain and Frank Ocean.</p>
          <p>Currently on a semester long side quest for my Mind, Machine, Meaning class. Stay tuned.</p>
        </section>

        {/* clancystuff photo dump: hidden for now (CLANCYSTUFF data kept above) */}
        <section className="ab2-sec ab2-end">
          <h2 className="ab2-h">Say hi</h2>
          <p>Always down to chat. <a href="mailto:sophiaclancy@berkeley.edu">sophiaclancy@berkeley.edu</a></p>
        </section>
      </div>
    );
  }
  Object.assign(window, { AboutMain });
})();
