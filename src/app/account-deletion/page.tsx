import React from "react";

const AccountDeletionPolicy = () => {
	return (
		<div className="max-w-full mx-auto text-justify text-sm">
			<div className="font-verdana text-3xl text-center mb-4">
				HackPSU Account Deletion
			</div>
			<div>
				<p className="my-2">
					HackPSU offers users the ability to delete their account and all data
					associated with it. To delete your account, please use one of the
					following methods:
				</p>
				<ul className="list-disc ml-6 my-2">
					<li>
						Press the &quot;Delete Account&quot; button in the user profile page
						in our mobile application.
					</li>
					<li>
						Press the &quot;Delete Account&quot; button in the user profile page
						on our website.
					</li>
					<li>
						Send an email to &quot;technology@hackpsu.org&quot; with the subject
						line &quot;Account Deletion Request&quot;.
					</li>
				</ul>
			</div>
		</div>
	);
};

export default AccountDeletionPolicy;
