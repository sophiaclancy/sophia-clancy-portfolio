// writing.jsx: Writing tab. The list (Writing.html) and essays (window.ESSAY set by each essay page).
// Words are Sophia's thinking in her voice; facts only from what she's told us.
(function () {
  const WRITING = [
    { slug: "why-bugs", href: "Why-Bugs.html", title: "Why the bug imagery?", date: "Nov 19, 2026",
      dek: "Mantises, dining halls that look like ant farms, and where the line is between being a person and being part of a system." }
  ];

  function WhyBugs() {
    return (
      <React.Fragment>
        <p>If you&rsquo;ve clicked around here, you&rsquo;ve probably noticed the bugs. Ants walking along my projects, a whole ant farm in the footer, Casper pacing the bottom of the sidebar. They&rsquo;re decoration, sure, but they&rsquo;re also kind of how I see things.</p>

        <h2>Casper</h2>
        <p>Casper was a ghost mantis I got during quarantine. Everything was on pause, and he was the most patient thing in my room. Ghost mantises barely move. They hold one pose forever, swaying a little like a dead leaf, and then they strike once. I&rsquo;ve collected mantises ever since.</p>

        <h2>Kids and bugs</h2>
        <p>Years later I was working as a behavior technician, and I saw the same pull in the kids I worked with. Some of them normally couldn&rsquo;t sit still for more than a minute. Put a bug in front of them and they were locked in for ten, twenty minutes, just watching it walk. There&rsquo;s something grounding about simple movement. Nothing is asking anything of you. You just watch, and things start to make sense.</p>

        <h2>Every campus is an ant farm</h2>
        <p>Ants are the other half of it. I think about them every time I walk into a dining hall at noon. Everyone is on their own mission: grab a tray, find a friend, make it to class. But zoom out and it looks exactly like an ant farm. Lines form in the same spots every day. People take the same paths across campus. The same groups end up at the same tables. Nobody planned it, and it still runs like clockwork.</p>
        <p>A campus is a colony. So is a city, and so is a group chat.</p>

        <h2>There&rsquo;s no escaping systems</h2>
        <p>The world runs on systems, and there&rsquo;s no getting out of that. We&rsquo;re placed into families, schools, cities, jobs, and apps, and each one nudges how we move. A lot of what we call personal habit is really a response to the system around us: where the door is, what the default setting is, what everyone else is doing.</p>

        <h2>Where I draw the line</h2>
        <p>But I don&rsquo;t think that makes us just ants, and this is the part I keep coming back to. Each of us is also a whole person, growing in our own direction, with our own taste and stubbornness and weird hobbies. We&rsquo;re individuals blossoming inside systems we didn&rsquo;t choose. I think both are true at once, and the interesting stuff happens in the space between them.</p>

        <h2>How that shows up in my work</h2>
        <p>So that&rsquo;s how I work. I watch first, and I look for the pattern before I look for a solution: where people pile up, where they take a shortcut, where they give up. Then I ask which parts of that pattern come from the system and which come from the person. If it&rsquo;s the system, I can change the trail. If it&rsquo;s the person, I try to leave them room.</p>
        <p>It&rsquo;s also how I think about AI. Some things are trail, and a tool can carry them. Some things are the person, and those should stay human.</p>

        <p className="wr-end">So that&rsquo;s why the bugs. They remind me to watch before I build, and that every tiny thing running around is part of something bigger.</p>
      </React.Fragment>
    );
  }
  const BODIES = { "why-bugs": WhyBugs };

  function WritingMain() {
    const slug = window.ESSAY, e = WRITING.find((w) => w.slug === slug), Body = e && BODIES[slug];
    if (e && Body) {
      return (
        <article className="wr wr-essay">
          <a className="wr-back" href="Writing.html">&larr; All writing</a>
          <p className="wr-kick">A small aside</p>
          <h1 className="wr-h1">{e.title}</h1>
          <p className="wr-date">{e.date}</p>
          <div className="wr-body"><Body /></div>
          <p className="wr-foot"><a href="Writing.html">&larr; All writing</a><a href="About.html">About me &rarr;</a></p>
        </article>
      );
    }
    return (
      <div className="wr wr-list">
        <h1 className="wr-h1">Food for thought</h1>
        <p className="wr-sub">and the occasional brain dump.</p>
        <ul className="wr-items">
          {WRITING.map((w) => (
            <li key={w.slug}><a href={w.href}>
              <span className="wr-t">{w.title}</span><span className="wr-d">{w.date}</span>
              <span className="wr-dek">{w.dek}</span>
            </a></li>
          ))}
        </ul>
      </div>
    );
  }
  Object.assign(window, { WritingMain, WRITING });
})();
