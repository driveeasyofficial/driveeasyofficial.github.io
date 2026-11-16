# DriveEasy Driving School

Static website for GitHub Pages (driveeasyofficial.github.io).

- Booking flow: choose car, choose 7 or 15 day course, enter address, submit.
- Driving license request form (index.html, "Driving License" tab).
- Booking, license, and contact submissions use FormSubmit to email the owner address set in `js/main.js` and `js/contact.js` (`OWNER_EMAIL`). FormSubmit may require the owner to activate the address before it can receive submissions.
- Payment: in advance when the vehicle arrives.
- Put photos in `assets/images/`, then use them in `pages/gallery.html`.


GIT_SSH_COMMAND='ssh -F /dev/null -i ~/.ssh/id_ed25519_driveeasy -o IdentitiesOnly=yes -o IdentityAgent=none' git push -u origin main