const messageTemplate = "Good morning [name],\n\nToday is the big day. Kindly remember to cast your vote in the student council elections. Let's choose accountable,transparent leadership that empowers every stratizen. Should you have any challenges, please send an email to electionscommittee@strathmore.edu\n\nWith gratitude,\nAlvin Nyandeje.\n#Alvin4president\n#the17th\n#tutakosajenaNyandeje";

function generateLinks(validContacts) {
  const contactsWithLinks = [];
  validContacts.forEach(contact => {
    const personalizedMessage = messageTemplate.replace('[name]', contact.name);
    const encodedMessage = encodeURIComponent(personalizedMessage);
    const link = `https://wa.me/${contact.phone}?text=${encodedMessage}`;
    contactsWithLinks.push({ name: contact.name, telephone: contact.phone, link });
    console.log(`Generated link for ${contact.name}: ${link}`);
  });
  return contactsWithLinks;
}

module.exports = { generateLinks, messageTemplate };
