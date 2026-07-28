"use client";

import { useState } from "react";
import { Save, Link2, FileSpreadsheet, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProfileData {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "John Smith",
    email: "demo@voiceagent.ai",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and integrations</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook URL
              </CardTitle>
              <CardDescription>Receive real-time notifications when calls complete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="https://your-app.com/webhooks/voiceagent" />
              <Button variant="outline" size="sm">
                Save Webhook
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Google Sheets
              </CardTitle>
              <CardDescription>Automatically log call results to a Google Sheet</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Badge variant="success">Connected</Badge>
              <Button variant="outline" size="sm">
                Disconnect
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                CSV Export
              </CardTitle>
              <CardDescription>Download all call logs and contacts as CSV</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Call Logs
              </Button>
              <Button variant="outline" size="sm">
                Export Contacts
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">Pro Plan</p>
                  <p className="text-muted-foreground text-sm">$49/month • Up to 2,000 calls</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <Button variant="outline">Change Plan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Call Minutes Used</span>
                  <span className="font-medium">847 / 2,000</span>
                </div>
                <Progress value={42} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-muted-foreground text-sm">Total Calls</p>
                  <p className="text-lg font-semibold">1,247</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Avg per Day</p>
                  <p className="text-lg font-semibold">42</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b py-2">
                  <span>Starter</span>
                  <span className="font-medium">$19/mo — 500 calls</span>
                </div>
                <div className="bg-primary/5 -mx-2 flex justify-between rounded border-b px-2 py-2">
                  <span className="font-medium">Pro (Current)</span>
                  <span className="font-medium">$49/mo — 2,000 calls</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span>Business</span>
                  <span className="font-medium">$99/mo — 5,000 calls</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Enterprise</span>
                  <span className="font-medium">Custom pricing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
