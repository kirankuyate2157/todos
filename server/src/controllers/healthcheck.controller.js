const healthcheck = (req, res) => {
    res.json({ message: "Server is running 🚀" });
};

export {
    healthcheck
}
