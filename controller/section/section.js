import express from "express";

import configureMiddleware from "../../config/middleware.js";
import supabase from "../../config/supabase.js";

import authenticateToken from "../../helper/token.js";

const app = express();
configureMiddleware(app);
const router = express.Router();

router.post("/api/section-templates", authenticateToken, async (req, res) => {
  try {
    const superAdminID = "3de65f44-6341-4b4d-8d9f-c8ca3ea80b80";
    const adminID = "0057ae60-509f-40de-a637-b2b6fdc1569e";

    if (req.user.role_id !== superAdminID && req.user.role_id !== adminID) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this resource",
      });
    }

    const { name, isDevelope } = req.body;

    const { data: section, error: insertError } = await supabase
      .from("section_templates")
      .insert({
        name: name,
        is_develope: isDevelope,
      })
      .select("*");

    if (insertError) {
      return res.status(500).json({
        success: false,
        message: insertError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section has been added",
      data: section,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/api/section-templates", authenticateToken,async (req, res) => {
  try {
    const { data: sections, error: getError } = await supabase.from("section_templates").select("*").order("created_at", { ascending: true });

    if (getError) {
      return res.status(500).json({
        success: false,
        message: getError.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/api/section-templates-id", authenticateToken,async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const { data: section, error: getError } = await supabase.from("section_templates").select("*").eq("section_id", id);

    if (section.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    if (getError) {
      return res.status(500).json({
        success: false,
        message: getError.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
});

router.put("/api/section-templates", authenticateToken, async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const superAdminID = "3de65f44-6341-4b4d-8d9f-c8ca3ea80b80";
    const adminID = "0057ae60-509f-40de-a637-b2b6fdc1569e";

    if (req.user.role_id !== superAdminID && req.user.role_id !== adminID) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this resource",
      });
    }

    const { name, isDevelope } = req.body;

    const { data: section, error: updateError } = await supabase
      .from("section_templates")
      .update({
        name: name,
        is_develope: isDevelope,
      })
      .eq("section_id", id)
      .select("*");

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: updateError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section has been updated",
      data: section,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.delete("/api/section-templates", authenticateToken, async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const superAdminID = "3de65f44-6341-4b4d-8d9f-c8ca3ea80b80";
    const adminID = "0057ae60-509f-40de-a637-b2b6fdc1569e";

    if (req.user.role_id !== superAdminID && req.user.role_id !== adminID) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this resource",
      });
    }

    const { data: section, error: deleteError } = await supabase.from("section_templates").delete().eq("section_id", id).select("*");

    if (deleteError) {
      return res.status(500).json({
        success: false,
        message: deleteError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section has been deleted",
      data: section,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default router;