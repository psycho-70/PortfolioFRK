"use client";
import React, { useState, useEffect } from "react";
import { Settings, Shield, Key, Globe, CheckCircle2, User } from "lucide-react";

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [adminInfo, setAdminInfo] = useState({ username: "adminfrk@gmail.com", role: "Super Admin" });
    const API_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <Settings className="text-purple-400" size={28} />
                    System Settings
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                    Manage your administrator profile, security preferences, and system endpoints
                </p>
            </div>

            {/* Profile Overview */}
            <div className="bg-[#111114] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                        FK
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">Furqan Khattak</h4>
                        <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
                            {adminInfo.role}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">{adminInfo.username}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                        <Globe className="text-purple-400" size={20} />
                        <div>
                            <p className="text-xs text-gray-500">Backend API URL</p>
                            <p className="text-sm font-semibold text-white">{API_URL}</p>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                        <Shield className="text-emerald-400" size={20} />
                        <div>
                            <p className="text-xs text-gray-500">Authentication</p>
                            <p className="text-sm font-semibold text-white">JWT + bcrypt Secured</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Notice */}
            <div className="bg-[#111114] border border-white/5 rounded-3xl p-6 sm:p-8">
                <div className="flex items-start gap-3">
                    <Key className="text-purple-400 mt-0.5 shrink-0" size={20} />
                    <div>
                        <h4 className="text-base font-bold text-white">Credentials &amp; Authentication</h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            Admin credentials and secrets are securely configured via your backend environment variables (`.env`).
                            To change the admin password, update `ADMIN_PASSWORD` and restart your backend service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
