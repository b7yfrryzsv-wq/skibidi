import type { ReactNode } from "react";

/**
 * Legal notices for the footer.
 *
 * These are structured templates, not finished copy. Every field the law
 * requires is present and in the right place, but the identifying details are
 * left as `<Fill>` blanks on purpose: they are facts about a specific legal
 * entity, and inventing them would produce a notice that is wrong in exactly
 * the way a legal notice must not be.
 *
 * Sources for the structure:
 *   - LCEN (loi n°2004-575), art. 6-III — publisher and host identification
 *   - RGPD, art. 13 — information to provide when collecting data
 *   - CNIL recommandation « cookies et autres traceurs » (2020)
 */

/** A blank the site owner must fill in before publishing. */
function Fill({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-900">
      {children}
    </mark>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7 first:mt-0">
      <h3 className="text-sm font-bold tracking-wide text-neutral-900 uppercase">
        {title}
      </h3>
      <div className="mt-2.5 space-y-2.5 text-[0.925rem] leading-relaxed text-neutral-600">
        {children}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p>
      <span className="font-medium text-neutral-800">{label} :</span>{" "}
      {children}
    </p>
  );
}

export const LEGAL_NOTICES = {
  mentions: {
    title: "Mentions légales",
    description:
      "Informations exigées par l’article 6-III de la loi pour la confiance dans l’économie numérique.",
    body: (
      <>
        <Section title="Éditeur du site">
          <Row label="Dénomination">EDF</Row>
          <Row label="Forme juridique">
            Association déclarée, régie par la loi du 1<sup>er</sup> juillet
            1901
          </Row>
          <Row label="Siège social">
            17 rue Henry Renaud, 85400 Luçon, France
          </Row>
          <Row label="SIRET">924 390 032 00010</Row>
          <Row label="SIREN">924 390 032</Row>
          <Row label="N° RNA">
            <Fill>numéro de déclaration en préfecture (W + 9 chiffres)</Fill>
          </Row>
          <Row label="N° TVA intracommunautaire">
            <Fill>
              à indiquer si l’association est assujettie ; sinon supprimer cette
              ligne
            </Fill>
          </Row>
          <Row label="Contact">
            <Fill>adresse e-mail et numéro de téléphone</Fill>
          </Row>
        </Section>

        <Section title="Directeur de la publication">
          <Row label="Nom et qualité">
            Tom Gousseau, représentant légal de l’association
          </Row>
        </Section>

        <Section title="Hébergeur">
          <p>
            Conformément à l’article 6-III de la LCEN, l’hébergeur doit être
            identifié nommément.
          </p>
          <Row label="Dénomination">
            <Fill>ex. Vercel Inc., OVH SAS…</Fill>
          </Row>
          <Row label="Adresse et téléphone">
            <Fill>à compléter</Fill>
          </Row>
        </Section>

        <Section title="Propriété intellectuelle et marques">
          <p>
            La marque <strong className="font-semibold text-neutral-800">EDF</strong>{" "}
            et le logo associé sont la propriété d’Électricité de France SA.
            Ils sont reproduits sur ce site avec l’autorisation de leur
            titulaire.
          </p>
          <Row label="Référence de l’autorisation">
            <Fill>contrat ou courrier d’autorisation, et sa date</Fill>
          </Row>
          <Row label="Nature du site">
            Site édité par l’EDF en qualité de partenaire
            autorisé. Il ne s’agit pas d’un site officiel d’Électricité de
            France SA.
          </Row>
        </Section>
      </>
    ),
  },

  donnees: {
    title: "Données personnelles",
    description:
      "Traitement de vos données au titre du RGPD (règlement UE 2016/679).",
    body: (
      <>
        <Section title="Responsable de traitement">
          <Row label="Identité">
            EDF — SIRET 924 390 032 00010
          </Row>
          <Row label="Adresse">17 rue Henry Renaud, 85400 Luçon, France</Row>
          <Row label="Représentant légal">Tom Gousseau</Row>
          <Row label="Contact pour les questions relatives aux données">
            <Fill>adresse e-mail dédiée</Fill>
          </Row>
          <Row label="Délégué à la protection des données">
            <Fill>coordonnées du DPO, si désigné</Fill>
          </Row>
        </Section>

        <Section title="Données collectées">
          <p>
            Les données recueillies via ce site sont celles que vous saisissez
            volontairement dans le formulaire, ainsi que les données techniques
            strictement nécessaires à son fonctionnement.
          </p>
          <Row label="Catégories de données">
            <Fill>
              lister précisément : nom, e-mail, téléphone, code postal, statut
              d’occupation…
            </Fill>
          </Row>
        </Section>

        <Section title="Finalités et base légale">
          <p>
            Le RGPD impose d’énoncer la finalité réelle du traitement, y compris
            lorsqu’il s’agit de prospection commerciale ou de transmission à des
            partenaires.
          </p>
          <Row label="Finalité">
            <Fill>
              décrire l’usage effectif : mise en relation, prospection, envoi
              d’offres commerciales…
            </Fill>
          </Row>
          <Row label="Base légale">
            <Fill>
              consentement (art. 6.1.a) pour la prospection — recueilli de façon
              libre, spécifique, éclairée et univoque
            </Fill>
          </Row>
        </Section>

        <Section title="Destinataires">
          <p>
            Si les données sont transmises à des partenaires, ceux-ci doivent
            être identifiés ou, à défaut, décrits par catégorie précise. Une
            mention générique du type « nos partenaires » est insuffisante.
          </p>
          <Row label="Destinataires">
            <Fill>lister les partenaires ou leurs catégories</Fill>
          </Row>
          <Row label="Transferts hors UE">
            <Fill>préciser le pays et la garantie applicable, le cas échéant</Fill>
          </Row>
        </Section>

        <Section title="Durée de conservation">
          <Row label="Prospection commerciale">
            <Fill>
              recommandation CNIL : 3 ans à compter du dernier contact
            </Fill>
          </Row>
        </Section>

        <Section title="Vos droits">
          <p>
            Vous disposez d’un droit d’accès, de rectification, d’effacement, de
            limitation, d’opposition et de portabilité, ainsi que du droit de
            retirer votre consentement à tout moment, sans que cela n’affecte la
            licéité du traitement déjà effectué.
          </p>
          <Row label="Exercice de vos droits">
            Par courrier à EDF, 17 rue Henry Renaud, 85400
            Luçon, ou par e-mail à <Fill>adresse dédiée</Fill>
          </Row>
          <p>
            Vous pouvez également introduire une réclamation auprès de la CNIL,
            3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, ou sur{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-primary underline underline-offset-2"
            >
              cnil.fr
            </a>
            .
          </p>
        </Section>
      </>
    ),
  },

  cookies: {
    title: "Cookies",
    description:
      "Traceurs déposés sur votre terminal et moyens de les refuser.",
    body: (
      <>
        <Section title="Ce que nous déposons">
          <p>
            Seuls les cookies strictement nécessaires au fonctionnement du site
            peuvent être déposés sans votre accord. Tous les autres — mesure
            d’audience non exemptée, publicité, partage social — requièrent
            votre consentement préalable et explicite.
          </p>
          <Row label="Cookies utilisés">
            <Fill>
              lister chaque traceur : nom, finalité, émetteur, durée de vie
            </Fill>
          </Row>
        </Section>

        <Section title="Durée de validité du consentement">
          <p>
            Le consentement est conservé 6 mois selon la recommandation de la
            CNIL, et les cookies déposés ne doivent pas excéder 13 mois. Le
            refus doit être aussi simple que l’acceptation.
          </p>
        </Section>

        <Section title="Retirer votre consentement">
          <p>
            Vous pouvez modifier votre choix à tout moment via le panneau de
            gestion des cookies, ou en configurant votre navigateur pour bloquer
            les traceurs. Le blocage des cookies non essentiels n’empêche pas la
            consultation du site.
          </p>
          <Row label="Lien vers le panneau de gestion">
            <Fill>à implémenter si des traceurs non essentiels sont posés</Fill>
          </Row>
        </Section>
      </>
    ),
  },
} as const;

export type LegalKey = keyof typeof LEGAL_NOTICES;
