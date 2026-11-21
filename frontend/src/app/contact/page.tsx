import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site, socialLinks } from "@/content/site";
import { photos } from "@/content/media";
import { ActionForm, Input, Select, SubmitButton, TextArea } from "@/components/forms";
import { PageHero, Section, SocialIcon, tint } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}, Abuja — phone, WhatsApp, email and office hours.`,
};

export default function ContactPage() {
  const channels = [
    { icon: Phone, label: "Call the office", value: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, "")}` },
    site.contact.whatsapp && { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${site.contact.whatsapp}` },
    site.contact.email && { icon: Mail, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: MessageCircle, label: "Facebook", value: "Message us on Facebook", href: site.social.facebook },
    { icon: Clock, label: "Office hours", value: site.contact.officeHours },
  ].filter((c) => !!c);
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>We&apos;d love to <em className="text-rose">hear from you.</em></>}
        intro="Questions, counselling, a dedication, a wedding or just to say hello — the church office is here to help."
        image={photos.preacher}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <ul className="grid gap-4">
              {channels.map(({ icon: Icon, label, value, href }, i) => {
                const body = (
                  <>
                    <Icon className={`size-5 shrink-0 ${tint(i).text}`} strokeWidth={1.6} aria-hidden />
                    <span>
                      <span className="block text-sm text-muted">{label}</span>
                      <span className="block font-semibold">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label} data-reveal>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-[4px] bg-white p-5 ring-1 ring-line transition hover:ring-ink">
                        {body}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 rounded-[4px] bg-white p-5 ring-1 ring-line">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 rounded-[4px] bg-ink p-6 text-paper" data-reveal>
              <MapPin className="size-6 text-rose" aria-hidden />
              <p className="display mt-3 text-xl">{site.address.line1}</p>
              <p className="text-white/70">{site.address.line2} · Plus Code {site.address.plusCode}</p>
              <div className="mt-5 flex gap-2">
                {socialLinks.map(([n, url]) => (
                  <a key={n} href={url} target="_blank" rel="noreferrer" aria-label={n} className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-ink">
                    <SocialIcon name={n} className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[4px] bg-white p-6 ring-1 ring-line md:p-10" data-reveal>
            <h2 className="display mb-8 text-3xl">Send a message</h2>
            <ActionForm formId="contact" successTitle="Message sent" className="grid gap-5 sm:grid-cols-2">
              <Input name="name" label="Name" required autoComplete="name" />
              <Input name="email" label="Email" type="email" required autoComplete="email" />
              <Input name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" />
              <Select
                name="topic"
                label="Topic"
                defaultValue="General enquiry"
                options={["General enquiry", "Counselling", "Child dedication", "Wedding", "Funeral / condolence", "Partnership", "Media & press"]}
              />
              <TextArea name="message" label="Message" required rows={6} className="sm:col-span-2" />
              <div className="sm:col-span-2">
                <SubmitButton>Send message</SubmitButton>
              </div>
            </ActionForm>
          </div>
        </div>
      </Section>
    </>
  );
}
