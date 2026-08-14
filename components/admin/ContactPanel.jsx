import MessagesInbox from "@/components/admin/MessagesInbox";

export default function ContactPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Contact Us</h2>
        <p className="mt-1 text-sm text-muted">Messages people send from your contact form.</p>
      </div>

      <MessagesInbox />
    </div>
  );
}
