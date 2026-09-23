import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { NewsletterCard } from './NewsletterCard';

const meta: Meta<typeof NewsletterCard> = {
  component: NewsletterCard,
  args: {
    title: (
      <>
        Abonnez-vous <br />à notre AstroNews !
      </>
    ),
    description:
      'Retrouvez dans notre newsletter mensuelle les dernières actualités tech, une sélection de ressources et le meilleur de twitter !',
    children: (
      <div id="mauticform_wrapper_abonnementnewsletter" className="mauticform_wrapper">
        <form
          autoComplete="false"
          method="post"
          action="https://info.eleven-labs.com/form/submit?formId=10"
          id="mauticform_abonnementnewsletter"
          data-mautic-form="abonnementnewsletter"
          encType="multipart/form-data"
          target="mauticiframe_abonnementnewsletter"
        >
          <div className="mauticform-error" id="mauticform_abonnementnewsletter_error"></div>
          <div className="mauticform-message" id="mauticform_abonnementnewsletter_message"></div>
          <div className="mauticform-innerform">
            <div className="mauticform-page-wrapper mauticform-page-1" data-mautic-form-page="1">
              <div
                id="mauticform_abonnementnewsletter_email"
                data-validate="email"
                data-validation-type="email"
                className="mauticform-row mauticform-email mauticform-field-1 mauticform-required"
              >
                <label
                  id="mauticform_label_abonnementnewsletter_email"
                  htmlFor="mauticform_input_abonnementnewsletter_email"
                  className="mauticform-label"
                >
                  E-mail
                </label>
                <input
                  id="mauticform_input_abonnementnewsletter_email"
                  name="mauticform[email]"
                  className="mauticform-input"
                  type="email"
                />
              </div>

              <div
                id="mauticform_abonnementnewsletter_consentement_rgpd"
                data-validate="consentement_rgpd"
                data-validation-type="checkboxgrp"
                className="mauticform-row mauticform-checkboxgrp mauticform-field-2 mauticform-required"
              >
                <div className="mauticform-checkboxgrp-row">
                  {' '}
                  <input
                    className="mauticform-checkboxgrp-checkbox"
                    name="mauticform[consentement_rgpd][]"
                    id="mauticform_checkboxgrp_checkbox_consentement_rgpd_Oui0"
                    type="checkbox"
                    value="Oui"
                  />
                  <label
                    id="mauticform_checkboxgrp_label_consentement_rgpd_Oui0"
                    htmlFor="mauticform_checkboxgrp_checkbox_consentement_rgpd_Oui0"
                    className="mauticform-checkboxgrp-label"
                  >
                    J’accepte que la société ELEVEN LABS utilise les informations recueillies à partir de ce formulaire
                    dans le cadre de la gestion de ma demande. Pour en savoir plus, consultez notre{' '}
                    <a href="https://eleven-labs.com/mentions/" target="_blank" rel="noreferrer">
                      politique de gestion des données personnelles
                    </a>
                  </label>
                </div>
              </div>

              <div id="mauticform_abonnementnewsletter_submit" className="mauticform-button-wrapper">
                <button
                  type="submit"
                  name="mauticform[submit]"
                  id="mauticform_input_abonnementnewsletter_submit"
                  className="mauticform-button btn btn-default"
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </div>

          <input type="hidden" name="mauticform[formId]" id="mauticform_abonnementnewsletter_id" value="10" />
          <input type="hidden" name="mauticform[return]" id="mauticform_abonnementnewsletter_return" value="" />
          <input
            type="hidden"
            name="mauticform[formName]"
            id="mauticform_abonnementnewsletter_name"
            value="abonnementnewsletter"
          />
          <input type="hidden" name="mauticform[messenger]" id="mauticform_abonnementnewsletter_messenger" value="1" />
        </form>
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof NewsletterCard>;

export const Overview: Story = {};

const WithFormInError: Story = {};
WithFormInError.args = {
  children: (
    <div id="mauticform_wrapper_abonnementnewsletter" className="mauticform_wrapper">
      <form
        autoComplete="false"
        method="post"
        action="https://info.eleven-labs.com/form/submit?formId=10"
        id="mauticform_abonnementnewsletter"
        data-mautic-form="abonnementnewsletter"
        encType="multipart/form-data"
        target="mauticiframe_abonnementnewsletter"
      >
        <div className="mauticform-error" id="mauticform_abonnementnewsletter_error"></div>
        <div className="mauticform-message" id="mauticform_abonnementnewsletter_message"></div>
        <div className="mauticform-innerform">
          <div className="mauticform-page-wrapper mauticform-page-1" data-mautic-form-page="1">
            <div
              id="mauticform_abonnementnewsletter_email"
              data-validate="email"
              data-validation-type="email"
              className="mauticform-row mauticform-email mauticform-field-1 mauticform-required"
            >
              <label
                id="mauticform_label_abonnementnewsletter_email"
                htmlFor="mauticform_input_abonnementnewsletter_email"
                className="mauticform-label"
              >
                E-mail
              </label>
              <input
                id="mauticform_input_abonnementnewsletter_email"
                name="mauticform[email]"
                className="mauticform-input"
                type="email"
              />
              <span className="mauticform-errormsg">Ceci est requis.</span>
            </div>

            <div
              id="mauticform_abonnementnewsletter_consentement_rgpd"
              data-validate="consentement_rgpd"
              data-validation-type="checkboxgrp"
              className="mauticform-row mauticform-checkboxgrp mauticform-field-2 mauticform-required"
            >
              <div className="mauticform-checkboxgrp-row">
                {' '}
                <input
                  className="mauticform-checkboxgrp-checkbox"
                  name="mauticform[consentement_rgpd][]"
                  id="mauticform_checkboxgrp_checkbox_consentement_rgpd_Oui0"
                  type="checkbox"
                  value="Oui"
                />
                <label
                  id="mauticform_checkboxgrp_label_consentement_rgpd_Oui0"
                  htmlFor="mauticform_checkboxgrp_checkbox_consentement_rgpd_Oui0"
                  className="mauticform-checkboxgrp-label"
                >
                  J’accepte que la société ELEVEN LABS utilise les informations recueillies à partir de ce formulaire
                  dans le cadre de la gestion de ma demande. Pour en savoir plus, consultez notre{' '}
                  <a href="https://eleven-labs.com/mentions/" target="_blank" rel="noreferrer">
                    politique de gestion des données personnelles
                  </a>
                </label>
              </div>
              <span className="mauticform-errormsg">
                N’oubliez pas de cocher cette case. Il est nécessaire que vous acceptiez de recevoir des informations ne
                notre part pour que nous puissions répondre à votre demande.
              </span>
            </div>

            <div id="mauticform_abonnementnewsletter_submit">
              <button
                type="submit"
                name="mauticform[submit]"
                id="mauticform_input_abonnementnewsletter_submit"
                className="mauticform-button btn btn-default"
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        <input type="hidden" name="mauticform[formId]" id="mauticform_abonnementnewsletter_id" value="10" />
        <input type="hidden" name="mauticform[return]" id="mauticform_abonnementnewsletter_return" value="" />
        <input
          type="hidden"
          name="mauticform[formName]"
          id="mauticform_abonnementnewsletter_name"
          value="abonnementnewsletter"
        />
        <input type="hidden" name="mauticform[messenger]" id="mauticform_abonnementnewsletter_messenger" value="1" />
      </form>
    </div>
  ),
};
