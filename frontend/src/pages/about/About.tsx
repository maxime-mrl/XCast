import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./About.css";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function About() {
    return (
        <>
            <div className="nav-container">
                <nav className="about-nav flex-nav">
                    <a className="link" href="/"><img src="/images/logo-transparent.png" className="text-img" alt="Logo XCcast" />Prévisions</a>
                    <span className="flex-nav">
                        <a className="link" href="#sources">Sources</a>
                        <a className="link" href="#contact">Contact</a>
                        <a className="link" href="#legal">légal</a>
                    </span>
                </nav>
            </div>
            <div className="about">
                <section className="header my-2">
                    <img src="/images/logo-512.png" alt="Logo XCcast" className="header-logo" />
                    <h1 className="h1 text-center">Bienvenue sur XCcast</h1>
                </section>
                <section id="sources" className="sources my-2">
                    <h2 className="h2">Nous utilisons des données tierces:</h2>
                    <article className="my-1">
                        <h3 className="h3">Modèles</h3>
                        <p className="mx-05">XCcast utilise pour fonctionner les données des modèles fournis par:</p>
                        <ul className="mx-05">
                            <li>Météo-France</li>
                            <li>DWD</li>
                            <li>Et beaucoup plus sont à venir!</li>
                        </ul>
                        <p className="mx-05">
                            N.B. Actuellement XCcast ne récupèrre aucunes données, les données affichés ne représentes aucune prévisions réelles
                        </p>
                    </article>
                    <article className="my-1">
                        <h3 className="h3">Cartographie</h3>
                        <p className="mx-05">La carte d'XCcast est affiché grâce à <a href="https://leafletjs.com/" target="_blank" className="link link-icon" rel="noreferrer">Leaflet</a></p>
                        <p className="mx-05">Les données de cartographie provienne de <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer" className="link link-icon">Esri</a>, Esri Japan, Esri China (Hong Kong), Esri (Thailand), DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom</p>
                    </article>
                </section>
                <section id="contact" className="contact my-2">
                    <h2 className="h2">Nous contacter</h2>
                    <p className="mx-05">Une question? Signaler un problème?</p>
                    <p className="mx-05">Envoyez-nous un mail ici: <a href="mailto:contact@maxime-morel.xyz" className="link">contact@maxime-morel.xyz</a></p>
                    <p className="mx-05">Je suis aussi disponible par discord <a href="https://discordapp.com/users/270219307475140608" target="_blank" className="link link-icon" rel="noreferrer">ici</a></p>
                </section>
                <section id="legal" className="legal my-2">
                    <h2 className="h2">Informations légale</h2>
                    <article className="mx-05">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur, sint iste et nesciunt quas veniam harum totam temporibus delectus error! Ad modi voluptas eaque aut harum quisquam, laboriosam similique voluptatibus!
                        Similique blanditiis tempora laboriosam beatae nesciunt veniam, temporibus sit ea eaque magni, voluptatem exercitationem a. Vitae repellendus accusantium quisquam maiores nihil neque in aut. Blanditiis voluptatibus nemo animi numquam nobis.
                        Rerum impedit architecto, error adipisci illo ratione quod distinctio, odit maiores aut maxime veniam? Iusto nam sed possimus nisi maiores ipsa. Itaque suscipit, labore officia optio sint inventore consectetur saepe!
                        Dignissimos similique, exercitationem quae at natus corrupti officia, adipisci velit voluptates, hic quos dolores sed. Dolorem consequuntur fugit voluptatibus incidunt autem ipsa atque maiores inventore sapiente, quidem illum neque quisquam!
                        Similique consectetur obcaecati voluptates ex distinctio. Maiores neque accusantium perferendis dolor alias aut, illo autem corporis iste voluptas dicta culpa, error aperiam minima praesentium sint repellat vel ratione qui et.
                        Odit tempora molestiae voluptate odio, incidunt ratione, voluptatibus sint, itaque expedita provident nam quos alias enim obcaecati assumenda dolorem esse maxime laudantium. Amet consectetur suscipit quisquam error aspernatur et repellat.
                        Similique corporis officiis, laudantium, nobis natus error doloremque quas placeat, voluptatum minus cupiditate eum corrupti distinctio! Aspernatur porro laudantium recusandae, iusto facilis assumenda, dicta veritatis quo quidem, rem soluta ab?
                        Facere cum cumque accusamus hic pariatur fuga, error, dicta exercitationem laborum distinctio a fugit mollitia voluptatum dolorum cupiditate dolorem obcaecati voluptas natus? Officiis minus hic a pariatur? Eum, architecto expedita!
                        Magni harum amet in molestiae illo debitis sunt! Corporis architecto molestiae dignissimos nemo fuga excepturi laborum distinctio itaque? Non reprehenderit modi consequatur labore voluptas ea doloribus explicabo cumque eius numquam!
                        Ipsum, nesciunt ipsa. Impedit eveniet earum quis ut laboriosam voluptatum, quo excepturi nemo beatae numquam ipsa illum dolorem eos suscipit neque soluta? Repellat, mollitia! Qui quae dolor id esse magni.
                        Odit, sapiente. Blanditiis necessitatibus perferendis explicabo cum consequuntur eligendi eaque molestias quos nisi debitis tenetur quo vel earum, deserunt quae sint sed. Cum voluptatum, mollitia in et iste illum voluptates.
                        Nemo inventore ipsa tenetur voluptatem adipisci officiis, quos sit esse! Vitae impedit architecto provident, quaerat voluptate cupiditate quam odio fugit, et magni animi quia, ipsum unde deleniti praesentium iste! Eos.
                        Cum saepe sapiente numquam recusandae repellat natus, similique omnis ad dolores fuga unde illo ab maxime quod cupiditate et voluptate quo eos optio enim! Iste laboriosam atque suscipit molestiae nam.
                        Eius dignissimos quos modi dolores ipsa unde nostrum nobis laudantium velit, officiis ex asperiores hic cupiditate architecto! Doloribus quae deserunt quaerat cupiditate inventore soluta? Delectus suscipit itaque asperiores esse et.
                    </article>
                </section>
            </div>
            <footer>
                <div className="footer-content">
                    <span>
                        <a href="/" className="link h2"><img src="/images/logo-transparent.png" className="text-img" alt="Logo XCcast" /> XCcast</a>
                    </span>
                    <p>Créé par <a href="https://maxime-morel.xyz" target="_blank" rel="noopener noreferrer" className="link link-icon">Maxime Morel</a></p>
                    <p><a href="mailto:contact@maxime-morel.xyz" className="link link-icon"><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>  contact@maxime-morel.xyz</a></p>
                    <p className="copy">&copy; XCcast {new Date().getFullYear()} - Tous droits réservés</p>
                </div>
            </footer>
        </>
    )
}