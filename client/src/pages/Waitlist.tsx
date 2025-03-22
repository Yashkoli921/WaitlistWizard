import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  plan: z.string(),
  consent: z.boolean().refine(value => value === true, {
    message: "You must agree to receive updates"
  })
});

type FormValues = z.infer<typeof formSchema>;

const Waitlist = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      plan: "Professional ($19.99/month)",
      consent: false
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest('POST', '/api/waitlist', data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join waitlist",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <section id="waitlist" className="py-16 md:py-24 bg-navy-dark relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark to-navy opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="royal-gradient p-8 md:p-12 rounded-2xl shadow-premium reflect-top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {!submitted ? (
              <>
                <div className="text-center mb-10">
                  <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Join Our <span className="text-gold">Exclusive Waitlist</span></h2>
                  <p className="text-gray-300">
                    Be among the first to experience our premium calculator suite. Early access members receive special benefits and pricing.
                  </p>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">First Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter your first name"
                                className="bg-navy border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:border-gold focus:outline-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter your last name"
                                className="bg-navy border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:border-gold focus:outline-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email"
                                placeholder="Enter your email address"
                                className="bg-navy border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:border-gold focus:outline-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mb-8">
                      <FormField
                        control={form.control}
                        name="plan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Interested Plan</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="bg-navy border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:border-gold focus:outline-none">
                                  <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-navy border border-gray-700">
                                <SelectItem value="Standard ($9.99/month)">Standard ($9.99/month)</SelectItem>
                                <SelectItem value="Professional ($19.99/month)">Professional ($19.99/month)</SelectItem>
                                <SelectItem value="Enterprise ($39.99/month)">Enterprise ($39.99/month)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mb-8">
                      <FormField
                        control={form.control}
                        name="consent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1 data-[state=checked]:bg-gold data-[state=checked]:text-dark"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-gray-300 text-sm">
                                I agree to receive updates about product launch and special offers. You can unsubscribe at any time.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-gold rounded-lg py-6 text-dark font-bold text-lg transition"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Processing..." : "Join the Waitlist"}
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-check text-2xl text-dark"></i>
                </div>
                <h3 className="font-playfair text-2xl font-bold mb-4">Thank You for Joining!</h3>
                <p className="text-gray-300 mb-6">You've been added to our exclusive waitlist. We'll notify you when we're ready to launch.</p>
                <p className="text-gold">Check your email for confirmation.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;
