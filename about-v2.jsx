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
            <p>I study cognitive science and data science at Berkeley. I learned frontend and full stack dev in my mobile dev club, then joined a design club and got hooked on design too. Now I do a bit of everything: research, design, and building.</p>
            <p>I&rsquo;m really into the human mind and psychology. The summer after freshman year I worked as a behavior technician and I loved it. I&rsquo;ve also always been obsessed with AI, world building, and imagination, and I want more of that in my work.</p>
          </div>
          <figure className="ab2-photo">
            <span className="ab2-photo-frame">
              <img className="ab2-base" src="assets/about-default.jpg" alt="Sophia holding a lemon slice" />
              <img className="ab2-hover" src="assets/about-hover.jpg" alt="" />
            </span>
          </figure>
        </section>

        <section className="ab2-sec">
          <h2 className="ab2-h">Outside of work</h2>
          <p>I&rsquo;m pretty adventurous. I love solo traveling, tandem biking, and a good dare or challenge. I grew up with one younger sister and now I have five more younger siblings (yes, five).</p>
          <p>I love being active. I play soccer and pickleball and I dance Brazilian zouk. Music is my favorite thing though. Dancing to it, going to concerts, all of it. I also paint, and I want to get into music production and fine dining cooking next.</p>
          <p>Big fan of Anthony Bourdain and Frank Ocean.</p>
          <p>Right now I&rsquo;m working on a semester long side quest for my machine learning class. Stay tuned.</p>
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
