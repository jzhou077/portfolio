import { profile } from "../content";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">Contact</h2>
      <p>
        Email is the best way to reach me: <a href={`mailto:${profile.email}`}>{profile.email}</a>. I'm also on{" "}
        <a href={profile.linkedin} target="_blank" rel="noopener">
          LinkedIn
        </a>
        .
      </p>
    </section>
  );
}
