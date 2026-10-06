import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { toast } from "react-toastify";
import Input from "../components/Input";

const ReceiveForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userId: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(API.RECEIVE_LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Invalid User ID or password");
                return;
            }
            toast.success("Id and Password is correct");

            navigate("/root", {
                state: {
                    mode: "receiver",
                    userId: result.userId,
                },
                replace: true,
            });
        } catch (error) {
            console.error("Receive login error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">

                <h2 className="text-2xl font-bold text-center mb-6">Receive File</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-medium">
                            User ID
                        </label>

                        <Input
                            type="text"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            placeholder="Enter User ID"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Password
                        </label>

                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter Password"
                            required
                        />
                    </div>

                    <div className="flex gap-4 pt-3">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full border border-gray-500 py-2 rounded-md"
                        > Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium disabled:opacity-50"
                        > {loading ? "Receive File..." : "Receive File"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ReceiveForm;