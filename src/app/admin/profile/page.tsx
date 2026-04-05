import React from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/app/actions/admin-users";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin/login");
    }

    const admin = await prisma.adminUser.findUnique({
        where: { id: session.user.id }
    });

    if (!admin) {
        redirect("/admin/login");
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-2xl font-serif text-primary">Your Profile</h2>
                <p className="text-sm text-muted-foreground">Manage your personal admin account settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Profile Details</CardTitle>
                    <CardDescription>Update your contact details or change your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updateProfile} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input name="name" defaultValue={admin.name || ""} placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" name="email" defaultValue={admin.email} placeholder="your.email@example.com" required />
                        </div>
                        <div className="space-y-2 pt-4 border-t border-border">
                            <Label>New Password</Label>
                            <Input type="password" name="password" placeholder="Leave blank to keep current password" minLength={6} />
                            <p className="text-xs text-muted-foreground">Enter a new password if you wish to change it.</p>
                        </div>
                        <Button type="submit" className="w-full sm:w-auto">Update Profile</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
