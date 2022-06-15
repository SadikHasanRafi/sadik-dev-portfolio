import React, { useRef } from "react";
import emailjs from '@emailjs/browser';


const ContactWithMe = () => {
    const form = useRef();
    const sendEmail= e => {
        e.preventDefault();

        

        emailjs.sendForm('service_xhzu6e3', 'template_p00advj', form.current, '5BO_HLz973nk7zuz6')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });

        console.log(e.target)
    }

    

  return (
    <div>
      <div class="hero min-h-screen  bg-white">
        <div class="hero-content flex-col lg:flex-row">
          <div class="text-center text-accent lg:text-left">
            <h1 class="text-5xl font-bold">Ask me</h1>
            <p class="py-6">
              Ask me if you have any querries. You will be answered via email.
            </p>
          </div>
          <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div class="card-body">
              {/* dummy forms start */}

                        <form
                            ref={form}
                            onSubmit={sendEmail}
                        >
                            {/* dummy form finish  */}

                            <div class="form-control">
                            <label class="label">
                                <span class="label-text text-accent">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                name="email"
                                class="input text-accent focus:shadow focus:shadow-yellow-200 focus:border-0 input-bordered shadow"
                            />
                            </div>

                            <div class="form-control">
                            <label class="label">
                                <span class="label-text text-accent">Question</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Your Question"
                                class="input text-accent focus:shadow focus:shadow-yellow-200 focus:border-0 h-20 input-bordered shadow"
                                name="quarries"
                            />
                            </div>
                            <div class="form-control mt-6">
                            <input
                                class="btn btn-primary shadow-md"
                                type="submit"
                                value="submit"
                            />
                            </div>
                        </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactWithMe;
