const messageTemplate = "Dear [name],\n\nAs we come to the end of the campaigns, I would like to first wish you all the best in your remaining examinations.\n\nI would also like to remind you to vote for Alvin Nyandeje on Friday 31st October. A vote for Alvin is a vote for Courage and Consistency.\n\n#Alvin4president\n\n#the17th";

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
