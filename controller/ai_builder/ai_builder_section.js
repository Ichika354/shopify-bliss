import express from "express";

import configureMiddleware from "../../config/middleware.js";
import supabase from "../../config/supabase.js";
import moment from "moment-timezone";

import authenticateToken from "../../helper/token.js";

const app = express();
configureMiddleware(app);
const router = express.Router();

router.post("/api/ai-builder-section", async (req, res) => {
  try {
    const { styleDesign, aiBuilderSupportID, sectionID, pageID, aiBuilderID } = req.body;
    const created_at = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

    const { data: aiBuilderSection, error: insertError } = await supabase
      .from("ai_builder_sections")
      .insert({
        style_design: styleDesign,
        section_id: sectionID,
        page_id: pageID,
        ai_builder_id: aiBuilderID,
        ai_builder_support_id: aiBuilderSupportID,
        created_at: created_at,
        updated_at: created_at,
      })
      .select("*");

    if (insertError) {
      console.error("Insert error:", insertError);
      return res.status(500).json({
        success: false,
        message: insertError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ai Builder Style has been added",
      data: aiBuilderSection,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/api/ai-builder-section", async (req, res) => {
  try {
    const { data: aiBuilderSection, error: selectError } = await supabase.from("ai_builder_sections").select(`*, sections:section_id(*), users:user_id(*), pages:page_id(*), ai_builder_supports:ai_builder_support_id(*)`);

    if (selectError) {
      console.error("Select error:", selectError);
      return res.status(500).json({
        success: false,
        message: selectError.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: aiBuilderSection,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;