// about-v2.jsx — About page content, rendered inside the sidebar shell from app-v13
(function () {
  const GROUPS = [
    { label: "designer", id: "designer", r: ["4/5", "4/5", "3/2"], m: [0, 26, 10] },
    { label: "builder", id: "builder", r: ["4/5", "3/2", "4/5"], m: [0, 18, 6] },
    { label: "dancer", id: "dancer", r: ["4/5", "3/2", "4/5"], m: [0, 22, 40] },
    { label: "fun-haver", id: "fun", r: ["3/2", "4/5", "3/2"], m: [0, 14, 34] },
  ];
  const COMMUNITIES = [
    { id: "bi", logo: "assets/logo-bi.png", name: "Berkeley Innovation", text: "Project Lead. Leading a design team on client projects with Notability and Partake Foods." },
    { id: "mdb", logo: "assets/logo-mdb.png", bg: "#DCEBFA", name: "Mobile Developers of Berkeley", text: "VP Marketing. The mobile development club where I started on frontend tasks and found my way into design." },
    { id: "jacobs", logo: "assets/logo-jacobs.png", name: "Jacobs Institute", text: "Figma Course Instructor. Teaching design through the Figma DeCal." },
  ];
  function AboutMain() {
    return (
      <div className="abx">
        <h1 className="abx-hi">Hi, I&rsquo;m Sophia!</h1>
        <div className="abx-intro">
          <div className="abx-text">
            <p className="abx-hook"><em>I&rsquo;ve got the eye of the tiger.</em></p>
            <p>I&rsquo;ve always found the white tiger beautiful, and I&rsquo;ve somewhat adopted it as my spirit animal&mdash; hence the constant references throughout my portfolio. I love what they represent: focus, independence, and fierce determination. That&rsquo;s the kind of energy I try to bring into how I show up as a student, designer, and leader.</p>
            <p>I&rsquo;m a product designer and builder at UC Berkeley, pursuing a double major in Cognitive Science and Data Science. I found my way into design through a mobile development club, where I started out working on frontend tasks. I realized pretty quickly that I loved being able to combine my creativity and eye for design with the technical side of building products, and that overlap is what really sparked my interest in product design.</p>
            <p>I&rsquo;ve also always been a very observant person. I&rsquo;m constantly noticing how people behave, psychoanalyzing why they do certain things, and listening to pop psychology podcasts. That naturally carries into how I design. I like thinking about the person behind the screen, how they might interpret something, what might confuse them, and what they actually need. At the same time, my background in full-stack development and data science helps me think about feasibility and technical constraints.</p>
            <p>I care deeply about designing for people who are often left out of the default experience, especially lower-income communities and people who don&rsquo;t have the same access to resources, networks, or insider knowledge. I&rsquo;m especially interested in reducing barriers created by the &ldquo;hidden curriculum&rdquo;, all of the unwritten information that can make opportunities feel much easier to navigate for some people than others.</p>
          </div>
          <figure className="abx-polaroid">
            <span className="abx-photo">
              <img className="abx-base" src="assets/about-default.jpg" alt="Sophia holding a lemon slice" />
              <img className="abx-hover" src="assets/about-hover.jpg" alt="" />
            </span>
            <figcaption>the eye of the tiger</figcaption>
          </figure>
        </div>
        <div className="abx-lists">
          <div>
            <span className="abx-label">Currently into</span>
            <ul>{["pickleball", "concerts", "hiking", "Brazilian zouk", "painting", "trying new food"].map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <span className="abx-label">Things I want to learn next</span>
            <ul>{["music production", "venue + lighting production", "fine-dining cooking"].map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
        <p className="abx-quote">Usually somewhere between making something, analyzing why people do things, and picking up a new side quest.</p>
        <section className="abx-sec">
          <span className="abx-label">My communities</span>
          <div className="abx-comms">
            {COMMUNITIES.map((c) => (
              <article className="abx-comm" key={c.id}>
                <h3><span className="abx-logo" style={c.bg ? { background: c.bg } : null}><img src={c.logo} alt="" /></span>{c.name}</h3>
                <p>{c.text}</p>
                <image-slot id={"abx-comm-" + c.id} shape="rounded" radius="12" fit="cover" placeholder={c.name + " photo"}></image-slot>
              </article>
            ))}
          </div>
        </section>
        <section className="abx-sec">
          <span className="abx-label">Education</span>
          <div className="abx-edu">
            <image-slot id="abx-edu-logo" shape="rounded" radius="8" fit="contain" placeholder="logo"></image-slot>
            <div><b>UC Berkeley</b><span>Double major in Cognitive Science and Data Science</span></div>
            <span className="abx-edu-loc">Berkeley, CA</span>
          </div>
        </section>
        <section className="abx-groups">
          {GROUPS.map((g) => (
            <div className="abx-group" key={g.id}>
              <span className="abx-label">{g.label}</span>
              <div className="abx-row">
                {g.r.map((r, i) => (
                  <image-slot key={i} id={"ab3-" + g.id + "-" + (i + 1)} shape="rect" fit="cover" placeholder="photo" style={{ aspectRatio: r, marginTop: g.m[i] + "px" }}></image-slot>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }
  Object.assign(window, { AboutMain });
})();
