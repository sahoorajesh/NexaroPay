import React from "react";
import { Link } from "react-router-dom";
import Shell from "../components/layout/Shell.jsx";
import heroWalletUrl from "../assets/hero-wallet.svg";
import Carousel from "../components/ui/Carousel.jsx";
import artPay from "../assets/carousel-pay.svg";
import artSplit from "../assets/carousel-split.svg";
import artStatus from "../assets/carousel-status.svg";
import { Icon } from "../components/ui/Icons.jsx";
import "./home.css";

function readSession() {
  try {
    const raw = localStorage.getItem("nx_auth");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function Home() {
  const auth = readSession();
  const name = auth?.user?.name;
  return (
    <Shell
      cta={
        <div className="homeTopCtas">
          {auth?.userId ? (
            <>
              <Link className="btn btn--ghost" to="/welcome">
                <Icon name="home" />
                Welcome{name ? ` ${name}` : ""}
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn--ghost" to="/login">
                <Icon name="user" />
                Sign in
              </Link>
              <Link className="btn btn--primary" to="/signup">
                <Icon name="add" />
                Sign up
              </Link>
            </>
          )}
        </div>
      }
    >
      <section className="hero">
        <div className="hero__copy">

          <div className="heroTitleRow">
            <img className="heroLogo" src="/favicon.png" alt="" />
            <h1 className="hero__title">NexaroPay eWallet</h1>
          </div>
          <div className="hero__eyebrow">Simple. Secure. Instant.</div>
          <p className="hero__lead">
            Send money, add balance, and keep track of your wallet activity in a calm, friendly interface built for
            everyday use.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/signup">
              <Icon name="add" />
              Get Started Free
            </Link>
            <Link className="btn btn--ghost" to="/login">
              <Icon name="wallet" />
              Open your Wallet
            </Link>
          </div>
          <div className="hero__trust">
            <div className="trustPill">Fast onboarding</div>
            <div className="trustPill">Clear status</div>
            <div className="trustPill">Built for growth</div>
          </div>
        </div>

        <div className="hero__media" aria-label="App preview">
          <div className="mediaFrame">
            <img className="mediaFrame__img" src={heroWalletUrl} alt="Wallet app preview illustration" />
            <div className="mediaFrame__glow" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="band__head">
          <h2 className="band__title">Everything you need to get started</h2>
          <p className="band__sub">
            A clean foundation for an eWallet experience. Add more flows as your app grows.
          </p>
        </div>
        <div className="band__grid">
          <div className="card">
            <div className="card__title">
              <span className="cardIcon" aria-hidden="true">
                ◉
              </span>
              Quick signup
            </div>
            <div className="card__body">Create a user account in seconds and continue building from there.</div>
          </div>
          <div className="card">
            <div className="card__title">
              <span className="cardIcon cardIcon--sky" aria-hidden="true">
                ◈
              </span>
              Friendly UI
            </div>
            <div className="card__body">A calm layout, readable typography, and smooth motion.</div>
          </div>
          <div className="card">
            <div className="card__title">
              <span className="cardIcon cardIcon--lime" aria-hidden="true">
                ◎
              </span>
              Ready to extend
            </div>
            <div className="card__body">Add wallet balance, transfers, and payment flows as next steps.</div>
          </div>
        </div>
      </section>

      <section className="qualities">
        <div className="qualities__head">
          <h2 className="qualities__title">Made for everyday payments</h2>
          <p className="qualities__sub">Simple flows, clear status, and a calm experience from start to finish.</p>
        </div>

        <Carousel
          ariaLabel="Everyday payments"
          items={[
            {
              id: "q1",
              title: "Easily pay and receive money",
              body: "Send or request payments seamlessly and keep your wallet clean and organized.",
              img: artPay,
            },
            {
              id: "q2",
              title: "Split bills with friends",
              body: "Divide expenses, track progress, and settle up without the back-and-forth.",
              img: artSplit,
            },
            {
              id: "q3",
              title: "Clear status, fewer surprises",
              body: "Know what’s happening with each action with friendly confirmations.",
              img: artStatus,
            },
          ]}
          render={(it) => (
            <article className="qCard">
              <img
                src={it.img}
                alt=""
                style={{
                  width: "100%",
                  height: 190,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                }}
              />
              <div className="qCard__content">
                <div className="qCard__title">{it.title}</div>
                <div className="qCard__body">{it.body}</div>
              </div>
            </article>
          )}
        />
      </section>

      <section className="offers">
        <div className="offers__head">
          <h2 className="offers__title">Offers and benefits</h2>
          <p className="offers__sub">Swipe or scroll to explore what makes NexaroPay feel effortless.</p>
        </div>

        <Carousel
          ariaLabel="Offers and benefits"
          items={[
            {
              id: "o1",
              tag: "Popular",
              title: "Zero commission",
              body: "Keep more of your money with simple, transparent pricing.",
              img: artPay,
            },
            {
              id: "o2",
              tag: "Speed",
              title: "Faster payments",
              body: "A flow that feels quick and predictable when it matters.",
              img: artStatus,
            },
            {
              id: "o3",
              tag: "Next-gen",
              title: "Modern payment portal",
              body: "Designed to scale from simple wallet tasks to richer journeys.",
              img: artSplit,
            },
            {
              id: "o4",
              tag: "Rewards",
              title: "Referral program",
              body: "Invite friends and unlock rewards as your network grows.",
              img: artPay,
            },
          ]}
          render={(it) => (
            <div className="offerCard">
              <img
                src={it.img}
                alt=""
                style={{
                  width: "100%",
                  height: 190,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                }}
              />
              <div className="offerCard__content">
                <div className="offerCard__tag">{it.tag}</div>
                <div className="offerCard__title">{it.title}</div>
                <div className="offerCard__body">{it.body}</div>
              </div>
            </div>
          )}
        />
      </section>

      <section className="ctaBand">
        <div className="ctaBand__inner">
          <div>
            <div className="ctaBand__title">Start with an account.</div>
            <div className="ctaBand__sub">Sign up now and use the app as you build the rest of the experience.</div>
          </div>
          <Link className="btn btn--primary" to="/signup">
            <Icon name="add" />
            Get Started Free
          </Link>
        </div>
      </section>
    </Shell>
  );
}
