import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./About.css";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function About() {
  return (
    <>
      <div className="nav-container">
        <nav className="about-nav content-width gap-1">
          <a className="link" href="/">
            <img
              src="/images/logo-transparent.png"
              className="text-img"
              alt="Logo XCast"
            />
            Prévisions
          </a>
          <span className="gap-1">
            <a className="link" href="#sources">
              Sources
            </a>
            <a className="link" href="#contact">
              Contact
            </a>
            <a className="link" href="#legal">
              légal
            </a>
          </span>
        </nav>
      </div>
      <div className="about content-width">
        <section className="header my-2">
          <img
            src="/images/logo-512.png"
            alt="Logo XCast"
            className="header-logo"
          />
          <h1 className="h1 text-center">Bienvenue sur XCast</h1>
        </section>
        <section id="sources" className="sources my-2">
          <h2 className="h2">Nous utilisons des données tierces:</h2>
          <article className="my-1">
            <h3 className="h3">Modèles</h3>
            <p className="mx-05">
              XCast utilise pour fonctionner les données des modèles fournis
              par:
            </p>
            <ul className="mx-05">
              <li>Météo-France</li>
              <li>DWD</li>
              <li>Et beaucoup plus sont à venir!</li>
            </ul>
            <p className="mx-05">
              N.B. Actuellement XCast ne récupère aucune donnée, les données
              affichées ne représentent aucune prévision réelle
            </p>
          </article>
          <article className="my-1">
            <h3 className="h3">Cartographie</h3>
            <p className="mx-05">
              La carte d'XCast est affichée grâce à{" "}
              <a
                href="https://leafletjs.com/"
                target="_blank"
                className="link link-icon"
                rel="noreferrer"
              >
                Leaflet
              </a>
            </p>
            <p className="mx-05">
              Les données de cartographie proviennent de{" "}
              <a
                href="https://www.esri.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-icon"
              >
                Esri
              </a>
              , Esri Japan, Esri China (Hong Kong), Esri (Thailand), DeLorme,
              NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom
            </p>
          </article>
        </section>
        <section id="contact" className="contact my-2">
          <h2 className="h2">Nous contacter</h2>
          <p className="mx-05">
            Une question? Signaler un problème? Proposer une amélioration?
          </p>
          <p className="mx-05">
            Envoyez-nous un mail ici:{" "}
            <a href="mailto:contact@maxime-morel.xyz" className="link">
              contact@maxime-morel.xyz
            </a>
          </p>
          <p className="mx-05">
            Nous sommes aussi disponible par Discord{" "}
            <a
              href="https://discordapp.com/users/270219307475140608"
              target="_blank"
              className="link link-icon"
              rel="noreferrer"
            >
              ici
            </a>
          </p>
        </section>
        <section id="legal" className="legal my-2">
          <h2 className="h2">Informations légales</h2>
          <article>
            <h3 className="h3">Non-responsabilité</h3>
            <div className="mx-05">
              <p>
                XCast n'est pas affilié à Météo-France, DWD ou à aucune autre
                source de données utilisée. XCast n'est pas responsable des
                prévisions affichées, elles sont fournies telles quelles. Les
                modèles de prévision météorologique peuvent être incorrects. Il
                tient à vous d'observer les conditions réelles sur places.
              </p>
            </div>
          </article>
          <article>
            <h3 className="h3">Données personnelles</h3>
            <div className="mx-05">
              <p>
                XCast ne collecte que les données strictement nécessaires pour
                le fonctionnement du site et l'amélioration de l'expérience
                utilisateur. Nous ne collections aucun cookie tiers, aucune
                information personnelle n'est partagée avec des services
                externes ou des partenaires commerciaux.
              </p>
              <p>Les données collectées peuvent inclure :</p>
              <ul>
                <li>Mail utilisateur</li>
                <li>Nom d'utilisateur</li>
                <li>Préférences d'affichages</li>
              </ul>
              <p>
                Ces données sont utilisées à des fins de synchronisation entre
                les différents appareils de l'utilisateur. Elles sont stockées
                de manière sécurisée et ne sont pas partagées avec des tiers.
              </p>
              <p>
                Vous pouvez supprimer vos données à tout moment en supprimant
                votre compte sur la rubrique "Mon compte" de XCast.
              </p>
            </div>
          </article>
          <article>
            <h3 className="h3">Modification de la politique</h3>
            <div className="mx-05">
              <p>
                XCast se réserve le droit de modifier cette politique à tout
                moment. Les modifications seront publiées sur cette page avec
                une date de mise à jour.
              </p>
              <p>Date de dernière mise à jour : 17/01/2025</p>
            </div>
          </article>
        </section>
      </div>
      <footer>
        <div className="footer-content content-width">
          <span>
            <a href="/" className="link h2">
              <img
                src="/images/logo-transparent.png"
                className="text-img"
                alt="Logo XCast"
              />{" "}
              XCast
            </a>
          </span>
          <p>
            Créé par{" "}
            <a
              href="https://maxime-morel.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-icon"
            >
              Maxime Morel
            </a>
          </p>
          <p>
            <a
              href="mailto:contact@maxime-morel.xyz"
              className="link link-icon"
            >
              <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>{" "}
              contact@maxime-morel.xyz
            </a>
          </p>
          <p className="copy">
            &copy; XCast {new Date().getFullYear()} - Tous droits réservés
          </p>
        </div>
      </footer>
    </>
  );
}
